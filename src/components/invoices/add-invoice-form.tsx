'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addInvoice } from '@/lib/actions';
import { Calendar as CalendarIcon, Trash } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';

const invoiceItemSchema = z.object({
  productName: z.string().min(2, 'Nome do produto inválido.'),
  quantity: z.coerce.number().int().min(1, 'Quantidade inválida.'),
  cost: z.coerce.number().min(0, 'Custo inválido.'),
});

const formSchema = z.object({
  supplier: z.string().min(2, 'Fornecedor inválido.'),
  date: z.date({
    required_error: 'A data da nota é obrigatória.',
  }),
  items: z.array(invoiceItemSchema).min(1, 'Adicione pelo menos um item.'),
});

type AddInvoiceFormProps = {
  onFinished: () => void;
};

export default function AddInvoiceForm({ onFinished }: AddInvoiceFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: '',
      date: new Date(),
      items: [{ productName: '', quantity: 1, cost: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });
  
  const watchedItems = useWatch({
    control: form.control,
    name: 'items',
  });

  const total = watchedItems.reduce((acc, item) => acc + item.cost * item.quantity, 0);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addInvoice({
        ...values,
        date: values.date.toISOString(),
    });
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      onFinished();
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: result.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fornecedor</FormLabel>
                <FormControl>
                    <Input placeholder="Nome do fornecedor" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Data da Nota</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                            ) : (
                                <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            <FormLabel>Itens da Nota</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-4 items-start border p-4 rounded-md relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash className="h-4 w-4" />
              </button>
              <FormField
                control={form.control}
                name={`items.${index}.productName`}
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel className="sr-only">Produto</FormLabel>
                    <FormControl>
                        <Input placeholder="Nome do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel className="sr-only">Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder='Qtd.' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.cost`}
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel className="sr-only">Custo (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder='Custo' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ productName: '', quantity: 1, cost: 0 })}
        >
          Adicionar Item
        </Button>
        
        {form.formState.errors.items && (
            <p className="text-sm font-medium text-destructive">
                {form.formState.errors.items.message || (form.formState.errors.items.root && form.formState.errors.items.root.message)}
            </p>
        )}

        <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onFinished}>Cancelar</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adicionando...' : 'Adicionar Nota'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
