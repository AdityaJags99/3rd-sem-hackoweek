// Shows the success / error message of a form. "status" is null or { type, message }.
function FormStatus({ status, className = '', id }) {
    return (
        <p
            id={id}
            className={`form-status form-status-${status ? status.type : 'success'} ${className}`}
            role="status"
            aria-live="polite"
            hidden={!status}
        >
            {status ? status.message : ''}
        </p>
    );
}

export default FormStatus;
