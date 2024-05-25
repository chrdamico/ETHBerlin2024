const hre = require("hardhat");

async function main() {

    const TrustComputer = await hre.ethers.getContractFactory("TrustComputer");
    const trustComputer = await TrustComputer.deploy();

    await trustComputer.deployed();

    console.log("trustComputer deployed to:", trustComputer.address);

    const Fiverrpunk = await hre.ethers.getContractFactory("Fiverrpunk");
    const fiverrpunk = await Fiverrpunk.deploy();

    await fiverrpunk.deployed();

    console.log("Fiverrpunk deployed to:", fiverrpunk.address);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });