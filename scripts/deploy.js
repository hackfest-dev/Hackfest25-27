import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const ProductNFT = await ethers.getContractFactory("ProductNFT");
  const productNFT = await ProductNFT.deploy();

  await productNFT.waitForDeployment();

  console.log("ProductNFT deployed to:", await productNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 