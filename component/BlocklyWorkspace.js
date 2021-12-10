import { BlocklyWorkspace } from 'react-blockly';
//import { useBlocklyWorkspace } from 'react-blockly';

// function MyBlocklyEditor() {
//   const [xml, setXml] = useState();

//   return (
//     <BlocklyWorkspace
//       className="width-100" // you can use whatever classes are appropriate for your app's CSS
//       toolboxConfiguration={MY_TOOLBOX} // this must be a JSON toolbox definition
//       initialXml={xml}
//       onXmlChange={setXml}
//     />
//   )
// }
// export default MyBlocklyEditor

const MyBlocklyEditor = () =>{
//function MyBlocklyEditor() {
  const blocklyRef = useRef(null);
  const { workspace, xml } = BlocklyWorkspace({
    ref: blocklyRef,
    toolboxConfiguration: MY_TOOLBOX, // this must be a JSON toolbox definition
    initialXml: xml,
  });

  return (
    <div ref={blocklyRef} /> // Blockly will be injected here
  )
}

export default MyBlocklyEditor