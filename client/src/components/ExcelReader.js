import React, { Component } from 'react'
import XLSX from 'xlsx'
import { Button, Modal, Container } from 'react-bootstrap'
import styles from '../stylesheets/home.module.css'
import axios from 'axios'
// import { motion } from "framer-motion"
// import { pageTransitions} from "../data/pageTransitions"
// import { pageVariants } from "../data/pageVariants"
import { config } from "../config";;



const SheetJSFT = [
  "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function (x) { return "." + x; }).join(",");

const make_cols = refstr => {
  let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
  return o;
};

class ExcelReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHide: false,
      test: "",
      messageData: {
        'message': ""
      },
      file: {},
      data: [],
      cols: []
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.appendProjectName = this.appendProjectName.bind(this);
  }

  appendProjectName() {
    for (var i = 0; i < this.state.data.length; i++) {
      this.state.data[i].projectName = this.state.file.name.split('.')[0];
    }
  }

  sendData(res) {
    var that = this;
    axios.post(config.baseURL + baseLOCATION + '/dailyTasks', {
      data: res
    })
      .then(function (response) {
        // alert(response.data.message + ' => imported: ' + response.data.imported + '; existing: ' + response.data.existing );
        console.log(response.data)
        that.setState({ messageData: response.data })
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide })
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };

  handleFile() {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: false, cellDates: true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, {
        header: 0,
        defval: "",
        raw: false,
        dateNF: 'YYYY-MM-DD'
      }

      );
      let filteredData = data.filter(data => data.Etat == 'A réaliser')
      /* Update state */
      this.setState({ data: filteredData, cols: make_cols(ws['!ref']) }, () => {
        this.appendProjectName();
        this.sendData(this.state.data);
        //console.log(JSON.stringify(this.state.data, null, 2));
      });

    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };
  }

  render() {
    return (

      // <motion.div
      //   initial="initial"
      //   animate="in"
      //   exit="out"
      //   variants={pageVariants}
      //   transition={pageTransitions}
      // >

      <Container fluid>
        <div className="upload-container">
          <label htmlFor="file" className={styles.text}>Upload your XLSX file by pressing "Upload"</label>
          <div >{this.state.messageData.message ? <div className="alert alert-success" role="alert">{this.state.messageData.message}</div> : null}</div>
          <div> {this.state.messageData.imported >= 0 ? <div className="alert alert-info" role="alert">imported items: {this.state.messageData.imported}</div> : null} </div>
          <div> {this.state.messageData.existing >= 0 ? <div className="alert alert-warning" role="alert">existing items: {this.state.messageData.existing}</div> : null} </div>
        </div>
        <Button variant="primary" className={styles.button} onClick={() => this.handleModalShowHide()}>
          Upload
              </Button>
        <Modal show={this.state.showHide}>
          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>Upload Page</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
              Close
                </Button>
            <Button variant="primary"
              onClick={() => { this.handleFile(); this.handleModalShowHide(); }}
            >
              Confirm
                </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      // </motion.div>

    )
  }
}

export default ExcelReader;