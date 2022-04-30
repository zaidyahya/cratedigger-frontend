import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecordVinyl } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const { apiEndpoint, authenticated } = useContext(AuthContext);

    return(
        <>
            {
                authenticated ? <Navigate to="/" replace />
                :
                <Row className='box-container' justify='center' align='middle'>
                    <Col className='col-color box-container-sub' sm={{ span: 12 }} xs={{ span: 24 }} >
                        
                        <Row justify='center' className='row-color box-row'>
                            <Col className='col-color page-icon-container' sm={{ offset: 1, span: 4 }} xs={{ span: 6 }} align='middle'>
                                <FontAwesomeIcon className='page-icon' icon={faRecordVinyl} size="5x" />
                            </Col>
                            
                            <Col className='col-color page-title-container' sm={{ offset: 0, span: 14 }} xs={{ offset: 1, span: 12 }}>
                                <h1 className='page-title'>crate digger</h1>
                            </Col>
                        </Row>

                        <Row justify='center' className='row-color box-row'>
                            <Col className='col-color' sm={{ span: 20 }} xs={{ span: 22 }}>
                                <p className='page-description'>
                                    Need new music? Sick of having to scroll artists' discography to see if they have anything new? 
                                    Been too busy to search for new music for a while?
                                    No problem! Use crate digger to see if your favourite artists have released any new music from a given date
                                </p>    
                            </Col>
                        </Row>

                        <Row justify='center' className='row-color box-row'>
                            <Col className='col-color' sm={{ span: 12 }} xs={{ span: 18 }} align='middle'>
                                <Button className='login-button' type='default' href={apiEndpoint+'/api/authorize'}>
                                    <FontAwesomeIcon className='login-button-icon' icon={faSpotify} size="2x" />
                                    <span>Log In With Spotify</span>
                                </Button>
                            </Col>
                        </Row>
                    
                    
                    </Col>
                </Row>
            }
      </>
    )
}

export default Login;