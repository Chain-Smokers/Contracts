const keyth = require("keythereum");
const { program } = require("commander");

program
  .name("getPrivateKey")
  .description("Get private key from keystore file")
  .version("0.0.1")
  .requiredOption("-a, --address <string>", "Address of account")
  .requiredOption("-d, --datadir <string>", "Data directory of account")
  .action((options) => {
    var keyObj = keyth.importFromFile(options.address, options.datadir);
    var privateKey = keyth.recover("password", keyObj);
    console.log(privateKey.toString("hex"));
  });

program.parse();
