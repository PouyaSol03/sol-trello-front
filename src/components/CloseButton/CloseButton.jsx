/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import { HiX } from 'react-icons/hi';
import classNames from 'classnames';

const CloseButton = forwardRef((props, ref) => {
    const { absolute, className, defaultStyle, ...rest } = props;
    const closeButtonAbsoluteClass = 'absolute z-10';

    const closeButtonClass = classNames(
        'close-btn',
        defaultStyle && 'close-btn-default',
        absolute && closeButtonAbsoluteClass,
        className
    );

    return (
        <span className={closeButtonClass} role="button" {...rest} ref={ref}>
            <HiX />
        </span>
    );
});

CloseButton.displayName = 'CloseButton';

export default CloseButton;
