import React, { useEffect, useState } from 'react';
import {ethers} from 'ethers';

//EXTERNAL
import {contractAbi, contractAddress} from '../utils/constants'

export const TransactionContext = React.createContext()

const {ethereum} = window;

const getEthereumContract = () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract= new ethers.Contract(contractAddress, contractAbi, signer);
    return transactionContract;
}
export const TransactionProvider = ({children}) => {

    const [connectedAccount, setConnectedAccount] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: '',
        keyword: '',
        message: ''
    });

    //handle form date
const handleChange = (e, name) => {
    // setFormData({
    //   ...formData,
    //     [name]: e.target.value
    // })
    setFormData((prevState) => ({...prevState, [name]: e.target.value}))
} 



const getAllTransactions = async () => {
  try {
    if (ethereum) {
      const transactionsContract = getEthereumContract();

      const availableTransactions = await transactionsContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }));
      setTransactions(structuredTransactions);
    } else {
      console.log("Ethereum is not present");
    }
  } catch (error) {
    console.log(error);
  }
};

    //checkIfWalletIsConnected
    const checkIfWalletIsConnected = async () => {
        try {
            
            if(!ethereum) return alert('Please install MetaMask')
            const accounts = await ethereum.request({ method:'eth_accounts'});
             if(accounts.length) {
                 setConnectedAccount(accounts[0])

                 getAllTransactions();
             } else {
                console.log('No account found')
             }
        } catch (error) {
            console.log(error)
            throw new Error("No Ethereum Object found")
        }
    }


    const checkIfTransactionsExists = async () => {
      try {
        if (ethereum) {
          const transactionsContract = getEthereumContract();
          const currentTransactionCount = await transactionsContract.getTransactionCount();
  
          window.localStorage.setItem("transactionCount", currentTransactionCount);
        }
      } catch (error) {
        console.log(error);
  
        throw new Error("No ethereum object");
      }
    };

      // Connect Wallet
      const connectWallet = async () =>{
        try {
            if(!ethereum) return alert('Please install MetaMask')
            const accounts = await ethereum.request({ method:'eth_requestAccounts'});
            setConnectedAccount(accounts[0])
        } catch (error) {
            console.log(error)
            throw new Error("No Ethereum Object found")
        }
      };


      //sending Transaction
      const sendTransaction = async () => {
        try {
          if (ethereum) {
            const { addressTo, amount, keyword, message } = formData;
            const transactionsContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
    
            await ethereum.request({
              method: "eth_sendTransaction",
              params: [{
                from: connectedAccount,
                to: addressTo,
                gas: "0x5208", //21000 GWEI
                value: parsedAmount._hex,  //0.00001
              }],
            });
    
            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
    
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);
    
            const transactionsCount = await transactionsContract.getTransactionCount();
    
            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();
          } else {
           console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

//  const shortenAddress = (connectedAccount) => `${connectedAccount.slice(0, 5)}...${connectedAccount.slice(connectedAccount.length - 4)}`;

 
    useEffect(() =>{
        checkIfWalletIsConnected()
        checkIfTransactionsExists()
    }, []);


    return (
        <TransactionContext.Provider value = {{ 
            connectWallet,
            connectedAccount,
            formData,
            setFormData,
            handleChange,
            sendTransaction,
            isLoading,
            transactions,
            
            }}>
            {children}
        </TransactionContext.Provider>
    )
}
  