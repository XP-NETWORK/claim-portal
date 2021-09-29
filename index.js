
let contract = '0xa65cb715e311e2fc45c2fb5545188067097a007c'
let title = 'Seed'
const W3 = new Web3(window.ethereum)
let accounts
window.onload = async function() {
    const { ethereum } = window
    const connect = document.getElementById('connect')
    if(ethereum) {
        const chainId = await W3.eth.getChainId()
            ethereum.on('chainChanged', (chainId) => {window.location.reload()})
            if(chainId === 56) {
            ethereum.on('accountsChanged', (a) => {
                accounts = a
                loggedIn(); 
            })
            if (typeof ethereum !== 'undefined' && ethereum.isMetaMask) {
                accounts = await getAccounts()
                if(accounts && accounts.length > 0) {
                    loggedIn()
                } else {
                    connectMetaMask()
                }
            }
        } 
        else {
            const b = document.getElementById('button')
            if(connect)connect.innerHTML = `<p class="warning"><strong>Connect MetaMask to BSC</strong></p>`
            if(b) b.style.display = 'none'
        }
    } 
    else {
        const main = document.getElementById('main')
        const b = document.getElementById('button')
        if(main)connect.innerHTML  = `<p>MetaMask is required</p>`
        if(b) b.style.display = 'none'
    }


}
const loggedIn = async () => {
        const b = document.getElementById('button')
        const connect = document.getElementById('connect')
        if(accounts && accounts.length > 0) {
        console.log
        if(b) b.style.display = 'none'
        if(connect) connect.style.display = 'none'
        callContract()
        setupSelector()
        queryData()
    } else {
        const main = document.getElementById('main')
        const info = document.getElementById('info')
        const rel = document.getElementById('release')
        if(info) info.innerHTML = ''
        if(rel) rel.innerHTML = ''
        if(main) main.innerHTML = ''
        if(b) b.style.display = ''
        if(connect) connect.style.display = ''

    }


}
const queryData = async () => {
    const info = document.getElementById('info')
    if(info) {
        info.innerHTML = ``
        const Contract = await new W3.eth.Contract(ABI, contract)
        const beneficiary = await Contract.methods.beneficiaries(accounts[0]).call()
        const releasableAmount = await Contract.methods.releasableAmount().call({from: accounts[0]})
        console.log(releasableAmount)
        if(beneficiary && releasableAmount) {
            const released = Web3.utils.fromWei(beneficiary.released, 'ether')
            const amount = Web3.utils.fromWei(beneficiary.amount, 'ether')
            const ra = Web3.utils.fromWei(releasableAmount, 'ether')
            const info = document.getElementById('info')
            const releaveDIV = document.getElementById('release')
            info.innerHTML = `
                <div class="int"><h3>${title} Allocation</h3> <p>${amount}</p></div>
                <div class="int"><h3>Already Claimed</h3> <p>${parseFloat(released).toFixed(2)}</p></div>
                <div class="int"><h3>Remaining</h3> <p>${parseFloat(amount - released).toFixed(2)}</p></div>
                <div class="int"><h3>Claimable now</h3> <p>${parseFloat(ra).toFixed(2)}</p></div>
            `
            releaveDIV.innerHTML = `
            <button class="release" onclick="release()">Claim</button>
            `
        }
    }

}
const release = async () => {
    console.log('hello')
    const claimbutton = Array.prototype.slice.call(document.getElementsByClassName('release'),0)[0]
    const Contract = await new W3.eth.Contract(ABI, contract)
    Contract.methods.release().send({from: accounts[0]})
    .on('receipt', function(receipt){
        queryData()
     })
    .on('transactionHash', async (tx) => {
        if(claimbutton) {
            claimbutton.style.pointerEvents = 'none'
            claimbutton.style.backgroundColor = 'grey'
            claimbutton.innerText = 'Claiming'
        }
    })
}
const callContract = () => {

}

const getAccounts = async function(){
    const { ethereum } = window
    return await ethereum.request({ method: 'eth_accounts' })

}

const connectMetaMask = function() { 
    const ethereumButton = document.getElementById('button');
    ethereumButton.addEventListener('click', () => {
        ethereum.request({ method: 'eth_requestAccounts' })
    });
}
const chooseContract = (e) => {contract = e.value;title=Contracts.filter(n => n.contract === e.value)[0].title;queryData()}

const setupSelector = () => {
    const main = document.getElementById('main')
    if(main) {
        main.innerHTML = `<select onChange="chooseContract(this)">${Contracts.map(n => `<option value="${n.contract}">${n.title}</option>`).join('\n')}</select>`
    }
}

const Contracts = [
    {
        title: 'Seed',
        contract: '0xa65cb715e311e2fc45c2fb5545188067097a007c'
    },
    {
        title: 'Strategic',
        contract: '0x84e0801e8f06b6f6c7fe86488baf8267c5f5a6e8'
    },
    {
        title: 'Private',
        contract: '0x65b18112bc161922d4c3df44674d825896d1a308'
    },


    // {
    //     title: 'Team',
    //     contract: '0x7e73f12c29098e658e38a6828f4978ea42b9bc2d'
    // },
    // {
    //     title: 'Advisor',
    //     contract: '0x7564eb1b15829d7eb02797595279aac4ff0bab00'
    // },
    // {
    //     title: 'Reserve',
    //     contract: '0xf501e47740c2b526d91808964540f03c816edbe2'
    // },
    // {
    //     title: 'Staking',
    //     contract: '0xd49816e5a59f4b8748ac04c411c6b8ac20a79ef2'
    // },
    // {
    //     title: 'Ecosystem',
    //     contract: '0xc7f37211a8f5bbf90a9745b3a62c6c6280279c2f'
    // },
]