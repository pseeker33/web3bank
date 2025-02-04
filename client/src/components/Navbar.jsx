import { useState, useCallback, useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Tooltip } from 'react-tooltip';
import "../Navbar.css";

// Función para obtener el color y nombre de la red
const getNetworkDetails = (chainId) => {
  switch (chainId) {
    case '0x1':
      return { color: '#1cc34a', name: 'Ethereum Mainnet' };
    case '0xaa36a7':
      return { color: '#f5a623', name: 'Sepolia Testnet' };
    default:
      return { color: '#e8e8e8', name: 'Unknown Network' };
  }
};

export const Navbar = ({
  account,
  balance,
  isRegistered,
  isOwner,
  setAccount,
  onConnectWallet
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [networkDetails, setNetworkDetails] = useState({ color: '#e8e8e8', name: 'Unknown Network' });
  const [copied, setCopied] = useState(false);

  // Efecto para la animación del balance
  useEffect(() => {
    if (balance !== displayBalance) {
      const start = displayBalance || 0;
      const end = balance || 0;
      const duration = 300; // ms
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Función de easing
        const easeOutQuad = (t) => t * (2 - t);
        const currentValue = start + (end - start) * easeOutQuad(progress);

        setDisplayBalance(Number(currentValue.toFixed(4)));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [balance]);

  // Efecto para detectar la red
  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setNetworkDetails(getNetworkDetails(chainId));

        // Escuchar cambios de red
        window.ethereum.on('chainChanged', (newChainId) => {
          setNetworkDetails(getNetworkDetails(newChainId));
        });
      }
    };

    checkNetwork();
  }, []);

  const handleLogout = useCallback(() => {
    setAccount(null);
    setIsMenuOpen(false);
  }, [setAccount]);

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address: ", error);
    }
  }, [account]);

  return (
    <div className="navbar">
      <div className="navbar-title">Simple Bank DApp</div>
      <div className="navbar-connected">
        {account && isRegistered || isOwner ? (
          <div className="profile-menu">
            <div
              className="avatar"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              <div className="navbar-balance-container">
                <span>{displayBalance ? `${displayBalance} ETH` : "Loading..."}</span>
                <div 
                  className="network-indicator" 
                  style={{ backgroundColor: networkDetails.color }}
                  data-tooltip-id="network-tooltip"
                  data-tooltip-content={networkDetails.name}
                />
              </div>
              <div className="avatar-container">
                <Jazzicon diameter={30} seed={jsNumberForAddress(account)} />
              </div>
            </div>
            {isMenuOpen && (
              <div className={`menu-dropdown ${isMenuOpen ? 'menu-open' : ''}`}>
                <div className="menu-item">
                  <div className="avatar-large">
                    <Jazzicon diameter={80} seed={jsNumberForAddress(account)} />
                  </div>
                </div>
                <div className="menu-item address-container">
                  <span className="dropdown-wallet-address">
                    {`${account.slice(0, 6)}...${account.slice(-4)}`}
                  </span>
                  <button 
                    onClick={handleCopyAddress} 
                    className="copy-btn"
                    data-tooltip-id="copy-tooltip"
                    data-tooltip-content={copied ? "Copied!" : "Copy address"}
                  >
                    <FiCopy size={16} />
                  </button>
                </div>
                <div className="menu-item">
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : !account ? (
          <div className="connect-navbar-wallet">
            <button onClick={onConnectWallet}>Conectar Wallet</button>
          </div>
        ) : ( 
          <div className="info-message">
            Please register
          </div>
        )}
      </div>
      <Tooltip id="network-tooltip" />
      <Tooltip id="copy-tooltip" />
    </div>
  );
};