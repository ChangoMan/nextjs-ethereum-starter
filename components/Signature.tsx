import { ethers } from 'ethers'
import { useState } from 'react'
import Button from './Button'

type SignatureProps = {
  web3Provider: any
}

function Signature({ web3Provider }: SignatureProps): JSX.Element {
  const [signature, setSignature] = useState('')
  const [messageToSign, setMessageToSign] = useState('')

  const [addressToVerify, setAddressToVerify] = useState('')
  const [signatureToVerify, setSignatureToVerify] = useState('')
  const [messageToVerify, setMessageToVerify] = useState('')

  const [verificationSuccess, setVerificationSuccess] = useState(false)

  const sign = async () => {
    const signer = web3Provider.getSigner()
    const newSignature = await signer.signMessage(messageToSign)
    setSignature(newSignature)
  }

  const verifySignature = () => {
    if (messageToVerify && signatureToVerify) {
      const addressFromMessage = ethers.utils.verifyMessage(
        messageToVerify,
        signatureToVerify
      )
      if (addressFromMessage === addressToVerify) {
        setVerificationSuccess(true)
      } else {
        setVerificationSuccess(false)
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('Invalid message or signature!')
    }
  }

  return (
    <div>
      <h2 className="mt-12 mb-8 font-semibold text-lg">Signature Component</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Enter Message"
          onChange={(e) => {
            setMessageToSign(e.target.value)
          }}
        />
      </div>
      <Button onClick={sign}>Sign</Button>
      <p className="mt-8">This is the signature: {signature}</p>
      <hr className="my-8" />
      <div className="mt-8">
        <input
          type="text"
          placeholder="Enter Address To Verify"
          onChange={(e) => {
            setAddressToVerify(e.target.value)
          }}
        />
      </div>
      <div className="mt-8">
        <input
          type="text"
          placeholder="Enter Signature To Verify"
          onChange={(e) => {
            setSignatureToVerify(e.target.value)
          }}
        />
      </div>
      <div className="mt-8">
        <input
          type="text"
          placeholder="Enter Message To Verify"
          onChange={(e) => {
            setMessageToVerify(e.target.value)
          }}
        />
      </div>
      <div className="mt-3">
        <Button onClick={verifySignature}>Verify</Button>
      </div>
      <p className="mt-8">
        Verification Status:{' '}
        {verificationSuccess ? 'Verified!' : 'Not Verified!'}
      </p>
    </div>
  )
}

export default Signature
