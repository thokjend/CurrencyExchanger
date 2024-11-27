/* import Header from "../components/Header";
import Select from "react-select";

export default function Transfer() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center pt-3">
      <Header name="Transfer" />

      <div className="text-center d-flex flex-column justify-content-center align-items-center border border-light p-5 rounded m-4 w-25">
        <div className="text-light d-flex justify-content-around align-items-center  w-100">
          <div>Transfer from</div>
          <Select />
        </div>
      </div>

      <div className="text-center d-flex flex-column justify-content-center align-items-center border border-light p-5 rounded m-4 w-25">
        <div className="text-light d-flex justify-content-around align-items-center  w-100">
          <div>Transfer To</div>
          <Select />
        </div>
      </div>
    </div>
  );
}
 */

import Header from "../components/Header";
import Select from "react-select";

export default function Transfer() {
  return (
    <div className="d-flex flex-column align-items-center pt-3">
      <Header name="Transfer" />
      <div className="border text-light p-4 rounded shadow-sm center fw-bold">
        <h5 className="text-center mb-4 fs-4">Transfer Details</h5>
        <div className="mb-3">
          <label htmlFor="transferFrom" className="form-label">
            Transfer From
          </label>
          <Select id="transferFrom" placeholder="Select an account" />
        </div>
        <div className="mb-3">
          <label htmlFor="transferTo" className="form-label">
            Transfer To
          </label>
          <Select id="transferTo" placeholder="Select an account" />
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-primary w-100 fw-bold fs-5">
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
