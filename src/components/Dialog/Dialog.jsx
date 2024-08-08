/* eslint-disable react/prop-types */
import Modal from 'react-modal';
import classNames from 'classnames';
import CloseButton from '../CloseButton';
import { motion } from 'framer-motion';
import useWindowSize from '../hooks/useWindowSize';

const Dialog = (props) => {
    const currentSize = useWindowSize();

    const {
        bodyOpenClassName,
        children,
        className,
        closable = true,
        closeTimeoutMS = 150,
        contentClassName,
        height,
        isOpen,
        onClose,
        overlayClassName,
        portalClassName,
        style,
        width = 520,
        ...rest
    } = props;

    const onCloseClick = (e) => {
        if (onClose) {
            onClose(e);
        }
    };

    const renderCloseButton = (
        <CloseButton
            absolute
            className="ltr:right-6 rtl:left-6"
            onClick={onCloseClick}
        />
    );

    const contentStyle = {
        content: {
            inset: 'unset',
        },
        ...style,
    };

    if (width !== undefined) {
        contentStyle.content.width = width;

        // Assume 'sm' breakpoint is 640px
        const smBreakpoint = 640;

        if (currentSize.width !== undefined && currentSize.width <= smBreakpoint) {
            contentStyle.content.width = 'auto';
        }
    }
    if (height !== undefined) {
        contentStyle.content.height = height;
    }

    const defaultDialogContentClass = 'dialog-content';

    const dialogClass = classNames(defaultDialogContentClass, contentClassName);

    return (
        <Modal
            className={{
                base: classNames('dialog', className),
                afterOpen: 'dialog-after-open',
                beforeClose: 'dialog-before-close',
            }}
            overlayClassName={{
                base: classNames('dialog-overlay', overlayClassName),
                afterOpen: 'dialog-overlay-after-open',
                beforeClose: 'dialog-overlay-before-close',
            }}
            portalClassName={classNames('dialog-portal', portalClassName)}
            bodyOpenClassName={classNames('dialog-open', bodyOpenClassName)}
            ariaHideApp={false}
            isOpen={isOpen}
            style={{ ...contentStyle }}
            closeTimeoutMS={closeTimeoutMS}
            {...rest}
        >
            <motion.div
                className={dialogClass}
                initial={{ transform: 'scale(0.9)' }}
                animate={{
                    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
                }}
            >
                {closable && renderCloseButton}
                {children}
            </motion.div>
        </Modal>
    );
};

Dialog.displayName = 'Dialog';

export default Dialog;
