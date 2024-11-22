async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const SimpleBank = await ethers.getContractFactory("SimpleBank");
  const simpleBank = await SimpleBank.deploy(500); // Asignar el fee (por ejemplo, 500 = 5%)

  // Esperar a que se despliegue el contrato antes de continuar
  await simpleBank.waitForDeployment();

  console.log("SimpleBank contract deployed to:", simpleBank.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  