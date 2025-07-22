interface Props {
    text: string
}

const Loader: React.FC<Props> = ({text}) => 
    <div className="flex justify-center items-center size-full">
        
        <div className="text-center">
            <span className="loader mb-5"></span>
            <p>{text}</p>
        </div>
    </div>
    

export default Loader;