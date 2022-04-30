import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Form, Input, DatePicker, Divider } from 'antd';
import TrackItem from './TrackItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecordVinyl, faMagnifyingGlass  } from '@fortawesome/free-solid-svg-icons';
import { faFileAudio, faHandPeace } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import { ScaleLoader } from "react-spinners";
import { AuthContext } from '../context/AuthContext';

function HomeDemo() {  
    const { apiEndpoint, onLogout } = useContext(AuthContext);

    const [ loading, setLoading ] = useState(false);
    const [ tracks, setTracks ] = useState({ tracks: null, search: null });
    const [ searchInput, setSearchInput ] = useState(null)
    const [ user, setUser ] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        init();
    }, []);


    function init() {
        fetchUserDetails()
    }

    function fetchUserDetails() {
        getUserDetails().then(data => {
            setUser(data['display_name'])
        })
        .catch((error) => {
            if(error['message'] === 'Unauthorized') {
                refreshToken().then(data => {
                    if(data['status'] === 'Success') {
                        fetchUserDetails()
                    }
                })
            }
        })
    }

    function disabledDate(current) {
        // Can not select days before today and today
        return current > moment().endOf('day');
    }

    function refreshToken() {
        return new Promise((resolve, reject) => {
            fetch(`${apiEndpoint}/api/refresh-token`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                resolve(response.json())
            })
            
        })
    }

    function getUserDetails() {
        return new Promise((resolve, reject) => {
            fetch(`${apiEndpoint}/api/user`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                if(!response.ok){
                    if(response.status === 401) {
                        reject(new Error('Unauthorized'))
                    }
                }
                else {
                    return response.json()
                }
            })
            .then((responseJson) => {
                resolve(responseJson)
            })
          })
    }

    function fetchArtistTracks(artist, startDate, endDate) {
        getArtistTracks(artist, startDate, endDate).then(data => {
            setLoading(false)
            setTracks({
                tracks: data['tracks']['items'],
                search: searchInput['artist']
            })
        })
        .catch((error) => {
            if(error['message'] === 'Unauthorized') {
                refreshToken().then(data => {
                    if(data['status'] === 'Success') {
                        fetchArtistTracks()
                    }
                })
            }
        })
    }

    function getArtistTracks(artist, startDate, endDate) {
        var url_with_query_params = `${apiEndpoint}/api/search?artist_name=${artist}&start_date=${startDate}&end_date=${endDate}`

        return new Promise((resolve, reject) => {
            fetch(url_with_query_params, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                if(!response.ok) {
                    if(response.status === 401) {
                        reject(new Error('Unauthorized'))
                    }
                }
                else {
                    return response.json();
                }
            })
            .then((json) => {
                // Only return the tracks that are actually for the artist searched, because since it's a search API, it returns not relevant results                
                json['tracks']['items'] = json['tracks']['items'].filter(
                    track => track['artists'].find( a => {
                        var normalized_search_artist = artist.toLowerCase()
                        var normalized_str = a['name'].toLowerCase()

                        // Remove accents/diacritics :- https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
                        normalized_str = normalized_str.normalize('NFD').replace(/\p{Diacritic}/gu, "")

                        return normalized_str.includes(normalized_search_artist)
                    }) 
                    ? track : null
                )
                resolve(json)
            })
          })
    }

    function onFinish(values) {
        setSearchInput({
            artist: values['artist'],
            start_date: values['startDate'].format('MM-YYYY'),
            end_date: values['endDate'].format('MM-YYYY')
        })

        setLoading(true)
    };

    useEffect(() => {
        if(searchInput) {
            fetchArtistTracks(searchInput['artist'], searchInput['start_date'], searchInput['end_date'])
        }
    }, [searchInput])


    return(
            <>
                <Row className='row-color header-container' justify='center' align='middle'>
                    <Col className='col-color' sm={{ span: 16 }} xs={{ span: 20 }}>
                        
                        <Row>
                            <Col sm={{ span: 8 }} xs={{ span: 16 }}>
                                
                                <Row>
                                    <Col className='header-icon-container'>
                                        <FontAwesomeIcon className='page-icon' icon={faRecordVinyl} size="2x" />
                                    </Col>

                                    <Col className='header-title-container' sm={{ offset: 1 }} xs={{ offset: 1 }}>
                                        <h3>crate digger</h3>
                                    </Col>
                                </Row>

                            </Col>

                            <Col sm={{ offset: 12, span: 4 }} xs={{ offset: 2, span: 6 }} align='end'>
                                <Button type='default' shape='round' className='logout-button' onClick={onLogout}>
                                    Logout
                                </Button>
                            </Col>
                        </Row>

                    </Col>
                </Row>


                <Row className='row-color top-container' justify='center' align='bottom'>
                    <Col className='col-color scene' sm={{ span: 16 }} xs={{ span: 20 }}>
                        
                        <Row className='row-color row-welcome-container'>
                            <Col className='col-color welcome-container' sm={{ span: 24 }}>
                                <h2>Welcome, {user}</h2>
                            </Col>
                        </Row>

                        <Row className='row-color row-welcome-subtitle-container'>
                            <Col className='col-color welcome-subtitle-container' sm={{ span: 24 }}>
                                <p>Let's find your music..</p>
                            </Col>
                        </Row>

                        <Row className='row-color search-container'>
                            <Form
                                layout='inline'
                                form={form}
                                onFinish={onFinish}
                            >  
 
                                <Form.Item
                                    name="artist"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter an artist',
                                            validateTrigger: 'onSubmit'
                                        }
                                    ]}
                                >
                                <Input 
                                    placeholder='Artist' 
                                    size="large" 
                                    prefix={<FontAwesomeIcon icon={faFileAudio} />}
                                />
                                </Form.Item>

                                <Form.Item
                                    name="startDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter a start date'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if(value) {
                                                    const isDateBefore = value.isSameOrBefore(getFieldValue('endDate'), 'month')
                                                    if(isDateBefore){
                                                        return Promise.resolve()
                                                    } else {
                                                        return Promise.reject(new Error('Incoherent dates'))
                                                    }
                                                }
                                                return Promise.reject(new Error("")) // For when rule is checked for nothing has been entered in either date field
                                            },
                                            validateTrigger: 'onSubmit'
                                        })
                                    ]}
                                >
                                    <DatePicker 
                                        picker='month'
                                        disabledDate={disabledDate} 
                                        allowClear={false}
                                        placeholder='Start Date'
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="endDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter an end date'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if(value) {
                                                    const isDateAfter = value.isSameOrAfter(getFieldValue('startDate'), 'month')
                                                    if(isDateAfter){
                                                        return Promise.resolve()
                                                    } else {
                                                        return Promise.reject(new Error('Incoherent dates'))
                                                    }
                                                }

                                                return Promise.reject(new Error("")) // For when rule is checked for nothing has been entered in either date field
                                            },
                                            validateTrigger: 'onSubmit'
                                        })
                                    ]}
                                >
                                    <DatePicker
                                        picker='month'
                                        disabledDate={disabledDate} 
                                        allowClear={false}
                                        placeholder='End Date'
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button 
                                        type='default'
                                        shape='round'
                                        size='large'
                                        icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                                        htmlType='submit'
                                    />
                                </Form.Item>

                            </Form>
                        </Row>
                        
                    </Col>
                </Row>

                <Row className='row-color divider-container' justify='center'>
                    <Col className='col-color' sm={{ span: 16 }} xs={{ span: 22 }}>
                        <Divider />
                    </Col>
                </Row>

                {/* The tracks container */}
                <Row className='row-color tracks-container' justify='center' align='top'>
                    <Col className='col-color' style={{ textAlign: loading ? 'center' : 'left' }} sm={{ span: 16 }} xs={{ span: 20 }}>

                         { loading ? <ScaleLoader
                                css=""
                                size={6}
                                color={"#ffffff"}
                                loading={loading}
                            /> : 
                            <Row gutter={[24,40]} className='row-color'>
                                {
                                    !loading && tracks['tracks'] && tracks['tracks'].length === 0 ?
                                    <Col span={24}>
                                        <p className='no-results'>No tracks found..</p>
                                    </Col> :
                                    !loading && tracks['tracks'] ?
                                        tracks['tracks'].map(track =>
                                            <Col className='col-color' sm={{ span: 6 }}>
                                                <TrackItem track={track} searchString={tracks['search']} />
                                            </Col>
                                        )
                                    : <></>
                                }
                            </Row>
                        }
                        
                    </Col>
                </Row>

                <Row className='row-color' justify='center'>
                    <Col className='col-color' sm={{ span: 16 }} xs={{ span: 22 }}>
                        <Divider style={{ backgroundColor: 'lightgray' }} />
                    </Col>
                </Row>
                
                {/* The footer container */}
                <Row className='row-color footer-container' justify='center' align='middle'>
                    <Col className='col-color' sm={{ span: 16 }} xs={{ span: 22 }}>
                        <p>
                            <FontAwesomeIcon icon={faHandPeace} />
                            &nbsp;Thank you for using crate digger - all rights reserved
                        </p>
                    </Col>
                </Row>

        </>
    )
}

export default HomeDemo;