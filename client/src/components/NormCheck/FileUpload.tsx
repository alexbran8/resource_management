import React, {useState} from 'react';
import ReactFileReader from 'react-file-reader';
import JSZip, { file } from 'jszip';
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import XLSX from 'xlsx';
import "./FileUpload.scss";

import ExcelReader from '../ExcelReader';

function getModalStyle() {
    return {
      width: '80%',
      maxWidth: '100vw',
      maxHeight: '100%',
      position: 'fixed',
      top: '50%',
      left:  '10%',
      transform: 'translate(0, -50%)',
      overflowY: 'auto'
    };
  }
  
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        position: 'absolute',
        width: 1500,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      button: {
          float: 'right',
          backgroundcolor: 'red',
      },
    }),
  );



export const UploadModal = (props) => {
  const [processStatus, setProcessStatus] = useState(3);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

    const classes = useStyles();

    const [modalStyle] = React.useState(getModalStyle);
    const make_cols = refstr => {
      let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
      for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
      return o;
    };

    const handleFile = (file) => {
      console.log(file)
      let newFile = file.name
      /* Boilerplate to set up FileReader */
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;


      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        console.log(data);
      };
      reader.readAsBinaryString(newFile);
    

    console.log(data)
  };
  
    

    const saveToDb = (file) => {
      try {
      var newProgress = progress
      console.log('this is the file data', file)
      newProgress++;
      setProgress(newProgress);
      }
      catch(error)  {
        console.log('there has been an error', error)
        console.log(error.message)
        setStatus(error.message)
    }
    }

    const handleZip = (zipFile) => {
        const zip = new JSZip();
        zip.loadAsync(zipFile[0])
            .then(function (zip) {
                var newProgress = progress
                Object.keys(zip.files).forEach((file, index) => {
                  handleFile(zip.files[file])


                  
                    // zip.files[file].async('string').then(function (fileData) {
                    //   handleFile(file)
                    //     // check if file exists in object if not add them
                    //     if (files.find(item => item.fileName === file) === undefined) {
                    //         //if not add file to archive
                    //         var updatedResults = [];
                    //         let updatedFiles = []
                    //         files.push({ fileName: file, content: fileData, status: 'read-from-client' });
                    //         updatedFiles = [...files];
                    //         newProgress++;
                    //         setProgress(newProgress);
                    //         setFiles(updatedFiles);
                    //     }
                    // })
                })
            })
            .catch(error => {
                console.log('there has been an error', error)
                console.log(error.message)
                setStatus(error.message)
            })
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>

         <button className={classes.button} type="button" onClick={props.handleModal}>
            <CloseIcon />
          </button>         
          <ExcelReader
          saveFunction={saveToDb} />
          {/* <ReactFileReader multipleFiles={false} fileTypes={[".zip"]} handleFiles={handleZip}>
                <Button color="primary" variant="contained">Upload ZIP</Button>
            </ReactFileReader> */}

            <svg viewBox="0 0 36 36" className="circular-chart">
                        {/* <div className="text"> {processStatus !== 0 ? (progress / processStatus * 100).toFixed(1) + '%' : 'waiting for files'}</div> */}
                        <text x="50%" y="60%" text-anchor="middle"  className="text">{processStatus !== 0 ? (progress / processStatus * 100).toFixed(1) + '%' : 'waiting for files'}</text>
                        <path class="circle"
                            stroke-dasharray={`${progress / processStatus * 100}, ${100}`}
                            d="M18 2.0945
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
        </div>
    )


    return (
        <div>
              {/* <Button variant="contained" color="primary"  onClick={handleOpen}>
        {props.operation}
      </Button> */}
      <Modal
       style={{display:'flex',alignItems:'center',justifyContent:'center'}}
        // setShowModalOpen={open}
        open={true}
        // onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
 
      </Modal>

        </div>
    )
}
