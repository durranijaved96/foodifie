export default function SuccessPage() {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#00A5AA' }}>
          Payment Successful! 🎉
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#637381' }}>
          Thank you for your subscription to Essential plan.
        </p>
        <a 
          href="/" 
          style={{ 
            color: '#fff',
            backgroundColor: '#00A5AA',
            padding: '12px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600
          }}
        >
          Go back to home
        </a>
      </div>
    );
  }