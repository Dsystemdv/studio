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
import { updateClient } from '@/lib/actions';
import type { Client } from '@/lib/types';

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  cpf: z.string().min(11, 'O CPF deve ter pelo menos 11 caracteres.'),
  address: z.string().min(5, 'O endereço deve ter pelo menos 5 caracteres.'),
  city: z.string().min(2, 'A cidade deve ter pelo menos 2 caracteres.'),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data de nascimento inválida.',
  }),
});

type EditClientFormProps = {
  client: Client;
  onFinished: () => void;
};

export default function EditClientForm({ client, onFinished }: EditClientFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: client.id,
      name: client.name,
      cpf: client.cpf,
      address: client.address,
      city: client.city,
      birthDate: client.birthDate,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await updateClient(values);
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                        <Input placeholder="Rua, Número, Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                        <Input placeholder="Cidade - Estado" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onFinished}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
