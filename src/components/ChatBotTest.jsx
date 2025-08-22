export default function ChatBotTest() {
  console.log("ChatBotTest component is rendering!");
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
        color: 'white',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '5px solid yellow',
        fontSize: '12px',
        fontWeight: 'bold'
      }}
    >
      TEST BOT
    </div>
  );
}