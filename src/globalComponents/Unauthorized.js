export default function Unauthorized() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <h1>You are not logged in!!!</h1>
      <p>
        Please <a href="/">reload</a> the page!
      </p>
    </div>
  )
}
