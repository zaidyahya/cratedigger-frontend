import React from 'react';
import { Row, Col } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkullCrossbones  } from '@fortawesome/free-solid-svg-icons';

function NoMatch() {
    return(
        <>
            <Row className='no-match-container' align='middle'>
                <Col className="dling" span={24}>
                    <h3 className='not-found-header'>
                        <FontAwesomeIcon icon={faSkullCrossbones} />
                        &nbsp;&nbsp;Page not found
                    </h3>
                </Col>
            </Row>
        </>
    )
}

export default NoMatch;