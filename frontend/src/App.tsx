import './App.css'

function App() {
const submithandler = ()=>{

}
  return <>
    <div className=' mx-auto h-30 w-50 font-mono text-red-900 border-10 border-solid border-green-900'>
      Enter your name
      <form onSubmit={submithandler}>
        <input type="text" placeholder='ex:- hardik' />
        <button className='cursor-pointer bg-green-700 text-blue-50 mx-auto'>Connect</button>
        </form>
    </div>
  </>
   
}
export default App
