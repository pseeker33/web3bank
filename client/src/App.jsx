import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { TransactionModal } from './components/TransactionModal';
import { ethers } from "ethers";
import SimpleBankABI from "./SimpleBankABI.json";
import { networkConfig } from "./config";
import { FaEthereum, FaWallet, FaUser, FaDownload, FaUpload } from 'react-icons/fa';
import { useToast } from "./context/ToastProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [walletDisconnected, setWalletDisconnected] = useState(false); // Estado para evitar mensajes duplicados
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });
  const [isLoading, setIsLoading] = useState({ balance: false, transaction: false });



  // Función para resetear el estado
  const resetState = () => {
    setAccount(null);
    setContract(null);
    setIsOwner(false);
    setIsRegistered(false);
    setTreasuryBalance(0);
    setUserBalance(0);
  };

  const addToast = useToast();

  // Efecto para escuchar cambios en las cuentas
  useEffect(() => {
    if (window.ethereum) {
      // Manejar cambio de cuentas
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          if (!walletDisconnected) {
            addToast("Wallet desconectada", "info");
            setWalletDisconnected(true); // Marcar como desconectado para no mostrar el toast repetidamente
          }
          // MetaMask está desconectado
          resetState();
        } else {
          // Nueva cuenta conectada
          setAccount(accounts[0]);
          checkContractDetails(accounts[0]);
          setWalletDisconnected(false);
        }
      });

      // Manejar cambio de red
      window.ethereum.on("chainChanged", () => {
        resetState();
        window.location.reload();
      });

      // Cleanup de los listeners cuando el componente se desmonta
      return () => {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      };
    }
  }, [addToast, walletDisconnected]);

  // Efecto para verificar la conexión inicial
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            const isCorrectNetwork = await checkNetwork();
            if (isCorrectNetwork) {
              setAccount(accounts[0]);
              await checkContractDetails(accounts[0]);
            }
          }
        } catch (error) {
          console.error("Error checking initial connection:", error);
        }
      }
    };

    checkConnection();
  }, []);
    

  // Función para verificar la red
  const checkNetwork = async () => {
    try {
      const { ethereum } = window;
      const chainId = await ethereum.request({ method: "eth_chainId" });
      const decimalChainId = parseInt(chainId, 16);

      console.log("Red actual:", decimalChainId);

      if (!networkConfig[decimalChainId]) {
        addToast(
          "Red no soportada. Use Sepolia o Localhost 8545", "info")
        // toast.error(
        //   "Red no soportada. Por favor, usa Sepolia o Localhost 8545"
        // );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al verificar la red", error);
      addToast("Error al verificar la red", "error");
      //toast.error("Error al verificar la red");
      return false;
    }
  };

  // Cargar contrato
  const loadContract = async () => {
    try {
      //obtener la dirección del contrato según la red
      const { ethereum } = window;
      const chainId = await ethereum.request({ method: "eth_chainId" });
      const decimalChainId = parseInt(chainId, 16);
      const contractAddress = networkConfig[decimalChainId]?.contractAddress;

      if (!contractAddress) {
        addToast(
          "No se pudo obtener la dirección del contrato para esta red.",
          "info"
        )
        // toast.error(
        //   "No se pudo obtener la dirección del contrato para esta red."
        // );
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const instance = new ethers.Contract(
        contractAddress,
        SimpleBankABI,
        signer
      );

      setContract(instance);
      return instance;
    } catch (error) {
      console.error("Error al cargar el contrato:", error);
      addToast("Error al cargar el contrato:", "error");      
      //toast.error(`Error al cargar el contrato: ${error.message}`);
      return null;
    }
  };

  // Verificar detalles del contrato
  const checkContractDetails = useCallback(async (account) => {
    try {
      const instance = await loadContract();
      if (!instance) {
        return; // Salimos si no hay instancia del contrato
      }

      const owner = await instance.getOwner();
      setIsOwner(owner.toLowerCase() === account.toLowerCase());

      const user = await instance.userDetails(account);
      const isActuallyRegistered =
        user.registrado || (user.firstName !== "" && user.lastName !== "");
      setIsRegistered(isActuallyRegistered);

      if (isActuallyRegistered) {
        const balanceInEth = ethers.formatEther(user.saldo);
        setUserBalance(balanceInEth);
        console.log("User balance:", balanceInEth, "ETH");
      }

      const treasury = await instance.treasuryBalance();
      setTreasuryBalance(ethers.formatEther(treasury));

      // Algunos logs para debugging
      console.log("Checking details for account:", account);
      console.log("Detalles completos del usuario:", {
        firstName: user.firstName,
        lastName: user.lastName,
        saldo: user.saldo.toString(),
        registrado: user.registrado,
      });
    } catch (error) {
      console.error("Error en checkContractDetails:", error);
      console.error("Account:", account);
      console.error("Contract state:", contract);
      addToast("Error al cargar los detalles del contrato", "error");
      //toast.error("Error al cargar los detalles del contrato");
    }
  }, [loadContract, setIsOwner, setIsRegistered, setUserBalance, setTreasuryBalance, addToast]);

  // Conectar wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        addToast("MetaMask no está instalado", "info");
        //toast.error("MetaMask no está instalado");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const isCorrectNetwork = await checkNetwork();

      if (!isCorrectNetwork) {
        addToast("Por favor, conecta a Sepolia o Localhost 8545", "info");
        //toast.error("Por favor, conecta a Sepolia o Localhost 8545");
        return;
      }

      setAccount(accounts[0]);
      await checkContractDetails(accounts[0]);
    } catch (error) {
      console.error("Error al conectar wallet:", error);
      addToast("Error conectando la wallet", "error");
      //toast.error("Error conectando la wallet");
    }
  };

  // Registrar usuario
  const registerUser = async (firstName, lastName) => {
    try {
      const gasEstimate = await contract.registerUser.estimateGas(
        firstName,
        lastName
      );

      const tx = await contract.registerUser(firstName, lastName, {
        from: account,
        gasLimit: BigInt(Math.ceil(Number(gasEstimate) * 1.5)), // Incremento de seguridad
        maxPriorityFeePerGas: ethers.parseUnits('1', 'gwei'), // Fee de prioridad
        maxFeePerGas: ethers.parseUnits('20', 'gwei') // Fee máximo
      });

      await tx.wait();
      addToast("Usuario registrado con éxito", "success");
      setIsRegistered(true);
      await checkContractDetails(account);
    } catch (error) {
      console.error("Error completo en registro:", error);

      // Manejo más detallado de errores
      if (error.code === "ACTION_REJECTED") {
        addToast("Transacción rechazada", "error");
      } else if (error.message?.includes("Ya estas registrado")) {
        addToast("Esta cuenta ya está registrada", "info");
      } else if (error.message?.includes("Solo el owner")) {
        addToast("La cuenta owner no puede registrarse como usuario", "info");
      } else if (error.code === -32603) {
        addToast("Error interno de red. Verifica configuraciones de Hardhat", "error");
      } else {
        addToast("Error en el registro. Por favor, intenta nuevamente", "error");
      }
    }
  };

  // Depositar
  const deposit = async (amount) => {
    try {
      // Nueva sintaxis para parseEther
      const tx = await contract.deposit({ value: ethers.parseEther(amount) });
      //const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
      addToast("Depósito realizado con éxito", "success");
      //toast.success("Depósito realizado con éxito");
      checkContractDetails(account);
    } catch (error) {
      console.error(error);
      addToast("Error realizando depósito", "error");
      //toast.error("Error realizando depósito");
    }
  };

  // Retirar
  const withdraw = async (amount) => {
    try {
      const tx = await contract.withdraw(ethers.parseEther(amount));
      //const tx = await contract.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
      addToast("Retiro realizado con éxito", "success");
      //toast.success("Retiro realizado con éxito");
      checkContractDetails(account);
    } catch (error) {
      console.error(error);
      addToast("Error realizando retiro", "error");
      //toast.error("Error realizando retiro");
    }
  };

  // Retirar tesorería (solo owner)
  const withdrawTreasury = async (amount) => {
    try {
      const tx = await contract.withdrawTreasury(ethers.parseEther(amount));
      //const tx = await contract.withdrawTreasury(ethers.utils.parseEther(amount));
      await tx.wait();
      addToast("Retiro de tesorería realizado con éxito", "success");
      //toast.success("Retiro de tesorería realizado con éxito");
      checkContractDetails(account);
    } catch (error) {
      console.error(error);
      addToast("Error retirando tesorería", "error");
      //toast.error("Error retirando tesorería");
    }
  };

  const handleTransaction = async (type, amount) => {
    setIsLoading({ ...isLoading, transaction: true });
    try {
      if (type === 'deposit') await deposit(amount);
      else if (type === 'withdraw') await withdraw(amount);
      else if (type === 'treasury') await withdrawTreasury(amount);
    } finally {
      setIsLoading({ ...isLoading, transaction: false });
    }
  };


// Renderizado
return (
  <div>
    <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={true} />
    <Navbar
      account={account}
      balance={userBalance}
      isRegistered={isRegistered}
      isOwner={isOwner}
      setAccount={setAccount}
      onConnectWallet={connectWallet}
    />
    
    <div className="main-container">
      {/* <h1>SimpleBank DApp</h1> */}
      
      {!account ? (
        <div className="card" >
          <h2>Conecta tu Wallet</h2>
          <FaWallet size={48} color="#60a5fa" style={{ marginBottom: "3rem" }}/>
          <button onClick={connectWallet}>
            <FaWallet /> Conectar MetaMask
          </button>
        </div>
      ) : (
        <div className="dashboard-grid">
          {!isRegistered && !isOwner && (
            <div className="card">
                <h2>Registro</h2>
                <div className="wallet-address">
                  <FaWallet />
                  <span>Wallet:</span>
                  {`${account.slice(0, 4)}...${account.slice(-4)}`}
                </div>   
                <form className="formulario" onSubmit={async (e) => {
                  e.preventDefault();
                  const { firstName, lastName } = e.target.elements;
                  if (!firstName.value || !lastName.value) {
                    addToast("Completa todos los campos", "info");
                    return;
                  }
                  e.target.querySelector("button").disabled = true;
                  try {
                    await registerUser(firstName.value.trim(), lastName.value.trim());
                  } finally {
                    e.target.querySelector("button").disabled = false;
                  }
                }}>
                  <input name="firstName" placeholder="Nombre" required minLength="2" maxLength="50" />
                  <input name="lastName" placeholder="Apellido" required minLength="2" maxLength="50" />
                  <button type="submit">
                    <FaUser /> Registrarse
                  </button>
                </form>
            </div>
          )}

          {isRegistered && (
            <div className="card">
              <h2>Operaciones</h2>
              <div className="wallet-address">
                <FaUser />
                <span>Usuario:</span>
                {`${account.slice(0, 4)}...${account.slice(-4)}`}
              </div>
              <div className="balance-container">
                <FaEthereum size={32} color="#60a5fa" />
                <span className="balance-amount">{userBalance} ETH</span>
              </div>
              <div className="transactions">
                <button 
                  onClick={() => setModalConfig({ isOpen: true, type: 'deposit' })}
                  disabled={isLoading.transaction}
                >
                  <FaDownload /> Depositar
                </button>
                <button 
                  onClick={() => setModalConfig({ isOpen: true, type: 'withdraw' })}
                  disabled={isLoading.transaction}
                >
                  <FaUpload /> Retirar
                </button>
              </div>
            </div>
          )}

          {isOwner && (
            <div className="card">
              <h2>Tesorería</h2>

              <div className="wallet-address">
                <FaUser />
                <span>Owner:</span>
                {`${account.slice(0, 4)}...${account.slice(-4)}`}
              </div>
              <div className="balance-container">
                <FaEthereum size={32} color="#60a5fa" />
                <span className="balance-amount">{treasuryBalance} ETH</span>
              </div>
              <button 
                onClick={() => setModalConfig({ isOpen: true, type: 'treasury' })}
                disabled={isLoading.transaction}
              >
                <FaUpload /> Retirar Tesorería
              </button>
            </div>
          )}
        </div>
      )}
    </div>

    <TransactionModal
      isOpen={modalConfig.isOpen}
      onClose={() => setModalConfig({ isOpen: false, type: null })}
      onSubmit={(amount) => handleTransaction(modalConfig.type, amount)}
      title={
        modalConfig.type === 'deposit' ? 'Depositar ETH' :
        modalConfig.type === 'withdraw' ? 'Retirar ETH' :
        'Retirar de Tesorería'
      }
      type={modalConfig.type}
    />
  </div>
);
}

export default App;
