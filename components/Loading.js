import ReactLoading from 'react-loading';

function Loading() {
    return (
        <center style={{display:"grid", placeItems:"center", height:"100vh"}}>
            <div>
                <img 
                    src="http://assets.stickpng.com/images/6092d6e5e4801d000467a0d2.png"
                    alt=""
                    height={200}
                    // style={{marginBottom: 5}}
                />
            </div>
            <ReactLoading type={'spin'} color={'lightgreen'} height={60} width={60} />
        </center>
    )
}

export default Loading
