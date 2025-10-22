export function Watermark() {
  const imagePath = `${import.meta.env.BASE_URL}photos/watermark.png`;
  
  return (
    <div
      className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-10 z-0"
      style={{
        backgroundImage: `url("${imagePath}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        imageRendering: 'crisp-edges',
      }}
    />
  );
}
