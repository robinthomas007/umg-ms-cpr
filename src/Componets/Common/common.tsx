import React from 'react'

export const tagRender = (props) => {
    const { label } = props;
    return (
        <div className='remove-first-coma' style={{ marginRight: 3 }}>
            <span>,</span> {label}
        </div>
    );
};