import PageHeader from "@/components/page-header";
import ClientsTable from "@/components/clients/clients-table";
import { getClients } from "@/lib/data";
import AddClientDialog from "@/components/clients/add-client-dialog";

export default async function ClientsPage() {
  const clients = await getClients();
  
  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Clientes" 
        actions={<AddClientDialog />}
      />
      <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <ClientsTable clients={clients} />
      </main>
    </div>
  );
}
