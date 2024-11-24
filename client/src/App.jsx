import { useState , useEffect } from "react";
import { ethers } from "ethers";
import SimpleBankABI from "./SimpleBankABI.json";
import { networkConfig } from './config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

   // Función para resetear el estado
   const resetState = () => {
    setAccount(null);
    setContract(null);
    setIsOwner(false);
    setIsRegistered(false);
    setTreasuryBalance(0);
    setUserBalance(0);
  };

  // Efecto para escuchar cambios en las cuentas
  useEffect(() => {
    if (window.ethereum) {
      // Manejar cambio de cuentas
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          // MetaMask está desconectado
          resetState();
          toast.info("Wallet desconectada");
        } else {
          // Nueva cuenta conectada
          setAccount(accounts[0]);
          checkContractDetails(accounts[0]);
        }
      });
    
          // Manejar cambio de red
          window.ethereum.on('chainChanged', () => {
            resetState();
            window.location.reload();
          });
    
          // Cleanup de los listeners cuando el componente se desmonta
          return () => {
            window.ethereum.removeListener('accountsChanged', () => {});
            window.ethereum.removeListener('chainChanged', () => {});
          };
        }
      }, []);


  // Efecto para verificar la conexión inicial
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
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
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const decimalChainId = parseInt(chainId, 16);

      console.log('Red actual:', decimalChainId);

      if (!networkConfig[decimalChainId]) {
        toast.error("Red no soportada. Por favor, usa Sepolia o Localhost 8545");
        return false;
      }
      return true;

    } catch (error) {
      console.error("Error al verificar la red", error);
      toast.error("Error al verificar la red");
      return false;
    }
  };

  // Cargar contrato
  const loadContract = async () => {
    try {
      //obtener la dirección del contrato según la red
      const { ethereum } = window;
      const chainId = await ethereum.request({ method: 'eth_chainId' });  
      const decimalChainId = parseInt(chainId, 16);
      const contractAddress = networkConfig[decimalChainId]?.contractAddress;

      if (!contractAddress) {
        toast.error("No se pudo obtener la dirección del contrato para esta red.");
        return null;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const instance = new ethers.Contract(contractAddress, SimpleBankABI, signer);

      
      setContract(instance);
      return instance;

    } catch (error) {
      console.error('Error al cargar el contrato:', error);
      toast.error(`Error al cargar el contrato: ${error.message}`);
      return null;
    }
  };

  // Verificar detalles del contrato
  const checkContractDetails = async (account) => {
    try {
      const instance = await loadContract();
      if (!instance) {
        return; // Salimos si no hay instancia del contrato
      }

      const owner = await instance.getOwner();
      setIsOwner(owner.toLowerCase() === account.toLowerCase());

      const user = await instance.userDetails(account);
      const isActuallyRegistered = user.registrado || (user.firstName !== '' && user.lastName !== '');
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
        registrado: user.registrado
      });


    } catch (error) {
      console.error('Error en checkContractDetails:', error);
      console.error('Account:', account);
      console.error('Contract state:', contract);
    toast.error("Error al cargar los detalles del contrato");
    }
  };
    


  // Conectar wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast.error("MetaMask no está instalado");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const isCorrectNetwork = await checkNetwork();

      if (!isCorrectNetwork) {
        toast.error("Por favor, conecta a Sepolia o Localhost 8545");
        return;
      }      
   
      setAccount(accounts[0]);
      await checkContractDetails(accounts[0]);

    } catch (error) {
      console.error('Error al conectar wallet:', error);
      toast.error("Error conectando la wallet");
    }
  };

  
  // Registrar usuario
  const registerUser = async (firstName, lastName) => {
    try {
      const gasEstimate = await contract.registerUser.estimateGas(firstName, lastName);
      const gasLimit = BigInt(Math.ceil(Number(gasEstimate) * 1.2));
  
      const tx = await contract.registerUser(firstName, lastName, {
        from: account,
        gasLimit: gasLimit
      });
      
      await tx.wait();
      toast.success("Usuario registrado con éxito");
      setIsRegistered(true);
      await checkContractDetails(account);
  
    } catch (error) {
      console.error('Error completo:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        toast.error("Error en la transacción. Verifica que tengas suficiente ETH para gas");
      } else if (error.message && error.message.includes("Ya estas registrado")) {
        toast.warning("Esta cuenta ya está registrada");
      } else if (error.message && error.message.includes("Solo el owner")) {
        toast.warning("La cuenta owner no puede registrarse como usuario");
      } else {
        toast.error("Error en el registro. Por favor, intenta nuevamente");
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
      toast.success("Depósito realizado con éxito");
      checkContractDetails(account);
    } catch (error) {
      console.error(error);
      toast.error("Error realizando depósito");
    }
  };

  // Retirar
  const withdraw = async (amount) => {
    try {
      const tx = await contract.withdraw(ethers.parseEther(amount));
      //const tx = await contract.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
      toast.success("Retiro realizado con éxito");
      checkContractDetails(account);
    } catch (error) {
      console.error(error);
      toast.error("Error realizando retiro");
    }
  };

  // Retirar tesorería (solo owner)
  const withdrawTreasury = async (amount) => {
    try {
      const tx = await contract.withdrawTreasury(ethers.parseEther(amount));
      //const tx = await contract.withdrawTreasury(ethers.utils.parseEther(amount));
      await tx.wait();
      toast.success("Retiro de tesorería realizado con éxito");
      checkContractDetails(account);
    } catch (error) {
      console.error(error);
      toast.error("Error retirando tesorería");
    }
  };

  // Renderizado
  return (
    <div>
      <ToastContainer />
      <h1>SimpleBank DApp</h1>
      {!account ? (
        <button onClick={connectWallet}>Conectar Wallet</button>
      ) : (
        <div>
          <p>Conectado: {account}</p>
          {isOwner && <p>Rol: Owner</p>}
          {!isRegistered && !isOwner && (
            <div> 
              <h2>Registro</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const { firstName, lastName } = e.target.elements;

                  //Validamos los campos antes de enviar la transacción
                  if (!firstName.value || !lastName.value) {
                    toast.error("Por favor completa todos los campos");
                    return;
                  }

                  // Deshabilitamos el botón durante el registro
                  e.target.querySelector('button').disabled = true;

                  try {
                    await registerUser(firstName.value.trim(), lastName.value.trim());
                  } finally {
                    // Rehabilitamos el botón
                    e.target.querySelector('button').disabled = false;
                  }
                }}
              >
                <input name="firstName" placeholder="Nombre" required minLength="2" maxLength="50" />
                <input name="lastName" placeholder="Apellido" required minLength="2" maxLength="50" />
                <button type="submit">Registrarse</button>
              </form>
            </div>
          )}
          {isRegistered && (
            <div>
              <h2>Cuenta</h2>
              <p>Saldo: {userBalance} ETH</p>
              <button
                onClick={() => {
                  const amount = prompt("¿Cuánto quieres depositar?");
                  if (amount) deposit(amount);
                }}
              >
                Depositar
              </button>
              <button
                onClick={() => {
                  const amount = prompt("¿Cuánto quieres retirar?");
                  if (amount) withdraw(amount);
                }}
              >
                Retirar
              </button>
            </div>
          )}
          {isOwner && (
            <div>
              <h2>Tesorería</h2>
              <p>Saldo Tesorería: {treasuryBalance} ETH</p>
              <button
                onClick={() => {
                  const amount = prompt("¿Cuánto quieres retirar de la tesorería?");
                  if (amount) withdrawTreasury(amount);
                }}
              >
                Retirar Tesorería
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

