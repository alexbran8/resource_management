import React from 'react'
import ReactFileReader from 'react-file-reader';

export const UploadModal = () => {

    const handleZip = (zipFile) => {
        const zip = new JSZip();
        zip.loadAsync(zipFile[0])
            .then(function (zip) {
                var newProgress = progress
                Object.keys(zip.files).forEach((file, index) => {
                    zip.files[file].async('string').then(function (fileData) {
                        // check if file exists in object if not add them
                        if (files.find(item => item.fileName === file) === undefined) {
                            //if not add file to archive
                            var updatedResults = [];
                            let updatedFiles = []
                            files.push({ fileName: file, content: fileData, status: 'read-from-client' });
                            updatedFiles = [...files];
                            newProgress++;
                            setProgress(newProgress);
                            setFiles(updatedFiles);
                        }
                    })
                })
            })
            .catch(error => {
                console.log('there has been an error', error)
                console.log(error.message)
                setStatus(error.message)
            })
    }


    return (
        <div>
            <ReactFileReader multipleFiles={false} fileTypes={[".zip"]} handleFiles={handleZip}>
                <Button color="primary">Upload ZIP</Button>
            </ReactFileReader>
        </div>
    )
}
