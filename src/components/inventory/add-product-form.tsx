'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useToast } from '@/hooks/use-toast';
import { addProduct } from '@/lib/actions';

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  category: z.string().min(2, 'A categoria deve ter pelo menos 2 caracteres.'),
  stock: z.coerce.number().int().min(0, 'O estoque não pode ser negativo.'),
  costPrice: z.coerce.number().min(0, 'O preço de custo não pode ser negativo.'),
  price: z.coerce.number().min(0, 'O preço de venda não pode ser negativo.'),
});

type AddProductFormProps = {
  onFinished: () => void;
};

export default function AddProductForm({ onFinished }: AddProductFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      stock: 0,
      costPrice: 0,
      price: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addProduct(values);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                    <Input placeholder="Vela de Lavanda" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Velas Aromáticas" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venda (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onFinished}>Cancelar</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
