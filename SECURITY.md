# Security Best Practices for Magic

## Overview

Magic is a non-custodial cryptocurrency application. This means users maintain full control of their private keys and funds. This document outlines security best practices for both users and developers.

## For Users

### Wallet Security

1. **Never Share Private Keys**
   - Your private keys = Your money
   - Magic never asks for your private keys
   - Wallet extensions manage your keys securely

2. **Verify Addresses**
   - Always double-check recipient addresses
   - One wrong character = lost funds forever
   - Use QR codes to reduce typos

3. **Start Small**
   - Test with small amounts first
   - Verify transactions complete successfully
   - Gradually increase amounts as you gain confidence

4. **Beware of Phishing**
   - Only use the official Magic URL
   - Check for HTTPS in your browser
   - Be suspicious of emails asking for wallet info

5. **Keep Software Updated**
   - Update browser regularly
   - Update wallet extensions
   - Update your operating system

### Transaction Security

1. **Gas Fees**
   - Ensure you have enough for both the transfer AND gas fees
   - Ethereum gas varies widely - check current rates
   - Bitcoin: higher fees = faster confirmation

2. **Transaction Limits**
   - Consider hardware wallets for large amounts (>$10,000)
   - Split large transfers into multiple transactions
   - Use multi-signature wallets for significant holdings

3. **Network Selection**
   - Verify you're on the correct network
   - Sending to wrong network = permanent loss
   - Double-check before confirming

## For Developers

### Code Security

1. **No Private Key Storage**
   ```typescript
   // NEVER do this
   const privateKey = "0x..."; // ❌ WRONG
   
   // ALWAYS use wallet extensions
   const provider = new ethers.BrowserProvider(window.ethereum); // ✅ CORRECT
   ```

2. **Input Validation**
   ```typescript
   // Always validate addresses
   if (!validateAddress(address, chain)) {
     throw new Error('Invalid address');
   }
   
   // Validate amounts
   if (amount <= 0 || isNaN(amount)) {
     throw new Error('Invalid amount');
   }
   ```

3. **Error Handling**
   ```typescript
   // Never expose sensitive errors to users
   try {
     await sendTransaction();
   } catch (error) {
     console.error('Internal error:', error); // Log for debugging
     throw new Error('Transaction failed'); // Generic user message
   }
   ```

4. **Dependencies**
   ```bash
   # Regularly update dependencies
   npm audit
   npm audit fix
   
   # Use exact versions in production
   "dependencies": {
     "ethers": "6.10.0" // Not "^6.10.0"
   }
   ```

### Smart Contract Interactions

1. **Gas Estimation**
   ```typescript
   // Always estimate gas before sending
   const gasEstimate = await contract.estimateGas.transfer(to, amount);
   const gasLimit = gasEstimate * 120n / 100n; // Add 20% buffer
   ```

2. **Transaction Confirmation**
   ```typescript
   // Wait for confirmations
   const tx = await signer.sendTransaction(txParams);
   await tx.wait(2); // Wait for 2 confirmations
   ```

3. **Slippage Protection**
   ```typescript
   // For swaps/exchanges, implement slippage
   const minOutput = expectedOutput * 0.95; // 5% slippage tolerance
   ```

### Application Security

1. **HTTPS Only**
   - Never deploy without HTTPS
   - Wallet extensions require secure context
   - Vercel provides HTTPS automatically

2. **Content Security Policy**
   ```javascript
   // next.config.js
   headers: [
     {
       key: 'Content-Security-Policy',
       value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
     }
   ]
   ```

3. **Rate Limiting**
   ```typescript
   // Prevent abuse
   const rateLimit = {
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   };
   ```

4. **CORS Configuration**
   ```javascript
   // Only allow your domain
   headers: [
     {
       key: 'Access-Control-Allow-Origin',
       value: 'https://yourdomain.com'
     }
   ]
   ```

### Data Privacy

1. **No Server-Side Storage**
   - Don't log wallet addresses
   - Don't store transaction data
   - Keep everything client-side

2. **LocalStorage Security**
   ```typescript
   // Encrypt sensitive data if storing
   const encrypted = encrypt(data, userPassword);
   localStorage.setItem('magic_data', encrypted);
   ```

3. **Session Management**
   ```typescript
   // Clear sensitive data on logout
   const logout = () => {
     localStorage.clear();
     sessionStorage.clear();
   };
   ```

## Compliance Considerations

### Know Your Customer (KYC)

For production with high volume:
- Implement identity verification
- Use services like Onfido or Jumio
- Store KYC data securely (encrypted)

### Anti-Money Laundering (AML)

- Monitor suspicious transaction patterns
- Implement transaction limits for unverified users
- Report suspicious activity as required

### Legal Requirements by Region

**United States:**
- Money Transmitter License (state-dependent)
- FinCEN registration
- State-specific regulations

**European Union:**
- MiFID II compliance
- GDPR for data privacy
- Payment Services Directive (PSD2)

**Other Regions:**
- Research local requirements
- Consult with legal experts
- Implement geo-blocking if needed

## Audit Checklist

Before production deployment:

- [ ] Code review completed
- [ ] Dependencies updated and audited
- [ ] No private keys in code
- [ ] Input validation implemented
- [ ] Error handling robust
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Rate limiting implemented
- [ ] Transaction confirmations required
- [ ] Gas estimation implemented
- [ ] Address validation working
- [ ] Amount validation working
- [ ] No sensitive data logged
- [ ] LocalStorage encrypted (if used)
- [ ] Terms of service created
- [ ] Privacy policy created
- [ ] Legal review completed
- [ ] Penetration testing done
- [ ] Bug bounty program considered

## Security Monitoring

### Implement Logging

```typescript
// Log important events (not sensitive data)
const logTransaction = (type: string, chain: string, status: string) => {
  console.log({
    timestamp: new Date(),
    type,
    chain,
    status,
    // NO addresses or amounts
  });
};
```

### Error Tracking

Use services like Sentry:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  beforeSend(event) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  }
});
```

### Uptime Monitoring

- Use UptimeRobot or similar
- Monitor wallet connection endpoints
- Alert on failures

## Incident Response

### If Security Issue Found

1. **Immediately:**
   - Disable affected features
   - Alert users via banner/email
   - Document the issue

2. **Within 24 hours:**
   - Deploy fix if available
   - Update users on status
   - Review logs for impact

3. **Within 7 days:**
   - Complete post-mortem
   - Update security measures
   - Communicate lessons learned

### Security Disclosure

- Create security@yourdomain.com email
- Respond to reports within 48 hours
- Consider bug bounty program

## Resources

### Security Tools
- [MythX](https://mythx.io/) - Smart contract security
- [Slither](https://github.com/crytic/slither) - Static analysis
- [OWASP](https://owasp.org/) - Web security

### Auditing Services
- [ConsenSys Diligence](https://consensys.net/diligence/)
- [Trail of Bits](https://www.trailofbits.com/)
- [OpenZeppelin](https://openzeppelin.com/security-audits/)

### Learning Resources
- [Ethereum Security](https://ethereum.org/en/developers/docs/security/)
- [Solana Security](https://docs.solana.com/developing/programming-model/security)
- [Bitcoin Security](https://bitcoin.org/en/secure-your-wallet)

## Conclusion

Security is an ongoing process, not a one-time task. Stay informed about:
- New vulnerabilities
- Best practices updates
- Regulatory changes
- Community discussions

Remember: In crypto, security mistakes can mean permanent loss of funds. Take security seriously!

---

**When in doubt, prioritize security over convenience.**
