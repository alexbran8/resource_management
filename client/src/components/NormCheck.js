import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { Table, Container, Row, Col } from 'react-bootstrap'

const GET_NORMS = gql`
  query {
    normCheckQuery {
            Date 
            Resource 
            wbsCustomer 
            Task
            taskComments
            timeWrittingComments
              billableHours
              realHour
              normOK
              normNOK
              status
            variation
    }
  }
`;

const GET_NORMS_NA = gql`
  query {
    normCheckQueryNA {
            Date 
            Resource 
            wbsCustomer 
            Task
            taskComments
            timeWrittingComments
              billableHours
              realHour
              normOK
              normNOK
              status
            variation
    }
  }
`;

const NormCheck = () => {
    const { data, loading: get_norms_loading, error: get_norms_error } = useQuery(GET_NORMS);
    const { data: dataNa, loading, error } = useQuery(GET_NORMS_NA);


    return (
        <div>
            Prior to checking the below table please update the files using the following <a target="_blank" href="https://apps.gdceur.eecloud.dynamic.nsn-net.net/tools/">application</a> (soon to be integrated here!!!)
            List of Norms having variance
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            Date
                        </th>
                        <th>
                        Resource Name
                        </th>
                        <th>
                            WBS
                        </th>
                        <th>
                            Capacity
                        </th>
                        <th>
                            Comments
                        </th>
                        <th>
                            TWC
                        </th>
                        <th>
                            Real Hours
                        </th>

                        <th>
                            Billable Hours
                        </th>

                        <th>
                            NORM OK
                        </th>
                        <th>
                            NORM NOK
                        </th>
                        <th>
                            Status
                        </th>
                        <th>
                            Variation
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.normCheckQuery && data.normCheckQuery.map((item, index) => {
                        return (
                            <tr key={item.index}>
                                <td>{item.Date}</td>
                                <td>{item.Resource}</td>
                                <td>{item.wbsCustomer}</td>
                                <td>{item.Task}</td>
                                <td>{item.taskComments}</td>
                                <td>{item.timeWrittingComments}</td>
                                <td>{item.billableHours}</td>
                                <td>{item.realHour}</td>
                                <td>{item.normOK}</td>
                                <td>{item.normNOK}</td>
                                <td>{item.status}</td>
                                <td>{item.variation}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <div>
                List of Norms having N/A Status
                <Table striped bordered hover>

                    <tbody>
                        {dataNa && dataNa.normCheckQueryNA && dataNa.normCheckQueryNA.map((item, index) => {
                            return (
                                <tr key={item.index}>
                                    <td>{item.Date}</td>
                                    <td>{item.Resource}</td>
                                    <td>{item.wbsCustomer}</td>
                                    <td>{item.Task}</td>
                                    <td>{item.taskComments}</td>
                                    <td>{item.timeWrittingComments}</td>
                                    <td>{item.billableHours}</td>
                                    <td>{item.realHour}</td>
                                    <td>{item.normOK}</td>
                                    <td>{item.normNOK}</td>
                                    <td>{item.status}</td>
                                    <td>{item.variation}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default NormCheck