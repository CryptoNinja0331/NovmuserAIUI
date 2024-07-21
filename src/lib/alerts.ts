import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";
import { promise } from "zod";

export type TAlertProps = Pick<
  SweetAlertOptions,
  "title" | "text" | "target" | "showCancelButton" | "confirmButtonText"
>;

export const showSuccessfulAlert = (props: TAlertProps) => {
  showAlert({
    icon: "success",
    ...props,
  });
};

export const showErrorAlert = (props: TAlertProps) => {
  showAlert({
    icon: "error",
    ...props,
  });
};

export const showWarningAlert = (props: TAlertProps) => {
  return showAlert({
    icon: "warning",
    ...props,
  });
};

const showAlert = ({
  showCancelButton = false,
  confirmButtonText = "OK",
  ...rest
}: TAlertProps & { icon: SweetAlertIcon }) => {
  return Swal.fire({
    confirmButtonColor: "linear-gradient(90deg, #a993fe, 0%, #7e61e7)",
    cancelButtonColor: "#d33",
    showCancelButton,
    confirmButtonText,
    ...rest,
  });
};
