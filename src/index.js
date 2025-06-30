const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function main() {
  // Criar um produto
  const produto = await prisma.produto.create({
    data: {
      nome: 'Produto Exemplo',
      preco: 19.99,
      quantidade: 10,
    },
  });
  console.log('Produto criado:', produto);

  // Listar todos os produtos
  const produtos = await prisma.produto.findMany();
  console.log('Todos os produtos:', produtos);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
  