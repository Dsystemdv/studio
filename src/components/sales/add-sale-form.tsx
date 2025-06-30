'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addSale } from '@/lib/actions';
import type { Product } from '@/lib/types';
import { Trash } from 'lucide-react';

const saleItemSchema = z.object({
  productId: z.string().min(1, 'Selecione um produto.'),
  quantity: z.coerce.number().int().min(1, 'A quantidade deve ser pelo menos 1.'),
  price: z.coerce.number(),
});

const formSchema = z.object({
  items: z.array(saleItemSchema).min(1, 'Adicione pelo menos um item à venda.'),
});

type AddSaleFormProps = {
  products: Product[];
  onFinished: () => void;
};

export default function AddSaleForm({ products, onFinished }: AddSaleFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [],
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

  const total = watchedItems.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addSale(values);
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

  const handleProductChange = (productId: string, index: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.price`, product.price);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
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
                name={`items.${index}.productId`}
                render={({ field }) => (
                  <FormItem className="col-span-7">
                    <FormLabel>Produto</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleProductChange(value, index);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map(product => (
                            <SelectItem key={product.id} value={product.id} disabled={product.stock === 0}>
                                {product.name} ({product.stock} em estoque)
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="col-span-5">
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
          onClick={() => append({ productId: '', quantity: 1, price: 0 })}
        >
          Adicionar Item
        </Button>
        
        {form.formState.errors.items && (
            <p className="text-sm font-medium text-destructive">
                {form.formState.errors.items.message}
            </p>
        )}

        <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onFinished}>Cancelar</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Registrando...' : 'Registrar Venda'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
