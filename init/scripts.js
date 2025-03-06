       const successMsg = "{{ success_msg }}";
        if (successMsg) {
            Swal.fire({
                title: 'Success!',
                text: successMsg,
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'custom-popup',
                    confirmButton: 'custom-confirm-button'
                }
            });
        }