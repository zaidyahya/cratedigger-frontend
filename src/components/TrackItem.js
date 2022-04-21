import React from 'react';
import { Row, Col, Image, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones  } from '@fortawesome/free-solid-svg-icons';

function TrackItem(props) {

    function getArtistsString() {
        var searchedArtist = props.track['artists']
                        .find( a => {
                            var normalized_search_artist = props.searchString.toLowerCase()
                            var normalized_str = a['name'].toLowerCase()
                            normalized_str = normalized_str.normalize('NFD').replace(/\p{Diacritic}/gu, "")
                            return normalized_str.includes(normalized_search_artist)  
                        })
                        ['name']        
        
        var featureArtists = props.track['artists']
                        .filter( artist => artist['name'] !== searchedArtist )
                        .map( filtered => filtered['name'] )
                        .join(', ')

        return featureArtists ? searchedArtist + ' (ft. ' + featureArtists + ')' : searchedArtist
    }

    return(
        <div className="track-item-container">
            <Image src={props.track['album']['images'][1]['url']} preview={false} className='track-image' />
            {/* <Row>
                <Col style={{border: 'none'}} sm={{ span: 20 }} xs={{ span: 20 }}>
                    <p className='track-name'>{props.track['name']}</p>
                </Col>
                <Col style={{border: 'none'}} sm={{ span: 4 }} xs={{ span: 4 }}>
                    <Button 
                        type="text"
                        className="headphones-button"
                        icon={<FontAwesomeIcon icon={faHeadphones} />}
                        size='large'
                        href={"spotify:track:"+props.track['uri']}
                        target="_blank"
                    />
                </Col>
            </Row>             */}
            <p className="track-headphones-container">
                <span className="track-name">
                    {props.track['name']}
                </span>
                <span className="headphones-button-span">
                    <Button 
                        type="link"
                        className="headphones-button"
                        icon={<FontAwesomeIcon icon={faHeadphones} />}
                        size='large'
                        href={props.track['uri']}
                        target="_blank"
                    />
                </span>
            </p>

            <p className='artist-name'>{getArtistsString()}</p>
            <p className='release-date'>{props.track['album']['release_date']}</p>  
        </div>
    )
}

export default TrackItem;