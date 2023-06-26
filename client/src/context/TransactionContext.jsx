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

    console.log({
        provider,
        signer,
        transactionContract,    
        
    })
}
export const TransactionProvider = ({children}) => {

    const [connectedAccount, setConnectedAccount] = useState();
    const [formData, setFormData] = useState({
        address: '',
        amount: '',
        keyword: '',
        message: ''
    });

    //checkIfWalletIsConnected
    const checkIfWalletIsConnected = async () => {
        try {
            
            if(!ethereum) return alert('Please install MetaMask')
            const accounts = await ethereum.request({ method:'eth_accounts'});
             if(accounts.length) {
                 setConnectedAccount(accounts[0])

                 ////getAllTransaction();
             } else {
                console.log('No account found')
             }
        } catch (error) {
            console.log(error)
            throw new Error("No Ethereum Object found")
        }
    }

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

      }
 
    useEffect(() =>{
        checkIfWalletIsConnected()
    }, []);


    return (
        <TransactionContext.Provider value = {{ 
            connectWallet,
            connectedAccount
            }}>
            {children}
        </TransactionContext.Provider>
    )
}
