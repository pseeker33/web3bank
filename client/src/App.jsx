import { useState } from "react";
//import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import SimpleBankABI from "./SimpleBankABI.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  // Conectar wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return toast.error("MetaMask no está instalado");
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      checkContractDetails(accounts[0]);
    } catch (error) {
      console.error(error);
      toast.error("Error conectando la wallet");
    }
  };

  // Cargar contrato
  const loadContract = async () => {

    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.providers.Web3Provider(window.ethereum);

    //getSigner() devuelve una Promise, por lo que necesitas usar await
    const signer = await provider.getSigner();
    const instance = new ethers.Contract(contractAddress, SimpleBankABI, signer);
    setContract(instance);
    return instance;
  };

  // Verificar detalles del contrato
  const checkContractDetails = async (account) => {
    const instance = await loadContract();
    const owner = await instance.getOwner();
    setIsOwner(owner.toLowerCase() === account.toLowerCase());
    const user = await instance.userDetails(account);
    setIsRegistered(user.registrado);
    if (user.registrado) {
      // Nueva sintaxis para formatear ethers
      setUserBalance(ethers.formatEther(user.saldo));
      //setUserBalance(ethers.utils.formatEther(user.saldo));
    }
    const treasury = await instance.treasuryBalance();
    setTreasuryBalance(ethers.formatEther(treasury));
  };

  // Registrar usuario
  const registerUser = async (firstName, lastName) => {
    try {
      const tx = await contract.registerUser(firstName, lastName);
      await tx.wait();
      toast.success("Usuario registrado con éxito");
      setIsRegistered(true);
    } catch (error) {
      console.error(error);
      toast.error("Error registrando usuario");
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
                onSubmit={(e) => {
                  e.preventDefault();
                  const { firstName, lastName } = e.target.elements;
                  registerUser(firstName.value, lastName.value);
                }}
              >
                <input name="firstName" placeholder="Nombre" required />
                <input name="lastName" placeholder="Apellido" required />
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














