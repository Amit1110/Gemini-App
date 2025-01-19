import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
 
    const [input,setInput] = useState(""); //state variable
    const [recentPrompt,setRecentPrompt] = useState("");
    const[prevPrompts,setPrevPrompts] = useState([]);
    const[showResult, setShowResult] = useState(false);
    const[loading, setLoading] = useState(false);
    const[resultData,setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(function (){
            setResultData(prev=>prev+nextWord);
        },75*index)
    }
 
    const onSent = async(prompt) => {
        
        setResultData("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)
        setPrevPrompts(prev=>[...prev,input]) //updates the state by creating array and appending input to the array
        const response = await run(input)
        let responseArray = response.split("**")
        let newArray = "";
        for(let i=0;i<responseArray.length;i++)
        {
            if(i==0 || i%2!=1)
            {
                newArray += responseArray[i];
            }
            else
            {
                newArray += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newArray.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for(let i=0;i<newResponseArray.length;i++)
        {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
        setResultData(newResponse2)
        setLoading(false)
        setInput("")
        

    }

    //onSent("What is react js")

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider