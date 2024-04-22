import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { LagerModal } from "../lager/LagerModal";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useApi } from "../ApiService";
import Select from "react-select";

export function AddNewFrischModal(props) {
  const api = useApi();
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);

  const close = () => {
    props.close();
  };

  const handleSelectChange = selectedOption => {
    setSelectedDiscrepancy(selectedOption.value);
};

    const save = async () => {
        let zuVielzuWenig = document.getElementById("zuVielzuWenigId").value;
        let discrepancyElement = "";
        let name = "";
        if (selectedDiscrepancy === null) {
            name = options[0].value;
            discrepancyElement = props.frischBestandForModal.find(item => item.name === options[0].value);
        } else {
            name = selectedDiscrepancy;
            discrepancyElement = props.frischBestandForModal.find(item => item.name === selectedDiscrepancy);
        }
        if (zuVielzuWenig === "") {
            zuVielzuWenig = 0;
        }
        
        const discrepancy = {
            bestand:  { ...discrepancyElement, type: "frisch" },
            gewollteMenge: 0,
            zuBestellendeGebinde: 0,
            zuVielzuWenig: zuVielzuWenig,
        };
        console.log(discrepancy);
        let response = await api.addDiscrepancyToLastOrderList(discrepancy);
        if (response.ok) {
            toast.success(name + " wurde erfolgreich zur Liste hinzugefügt.");
        } else {
            console.error("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        }
        props.updateParent();
        props.close();
    }

  const title = "Produkt hinzufügen";

  const options = props.frischBestandForModal.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const body = (
    <div style={{ width: "400px", height: "370px",  }}>
        <table style={{ width: "50vw"}}>
            <tr>
                <td style={{ padding: "0 0 10px 0px" }}>Produkt: <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={options[0]}
                    isClearable={true}
                    isSearchable={true}
                    onChange={handleSelectChange}
                    name="color"
                    options={options}
                    styles={{
                        container: (provided) => ({
                            ...provided,
                            width: "100%",
                        }),
                        control: (provided) => ({
                            ...provided,
                            height: "50px",
                        }),
                    }}
                /></td>
            </tr>
            <tr>
              <td>Zu Viel / Zu Wenig: <input id="zuVielzuWenigId" type="number" style={{width: "20%", height: "50px", border: "none", border: "solid 1px #ccc",  borderRadius: "5px"}} /></td>
            </tr>
        </table>
    </div>
  );

  const footer = (
    <>
        <Button variant="success" onClick={save}>Produkt hinzufügen</Button>
        <Button onClick={close}>Zurück</Button>
    </>
  );

  return (
    <LagerModal
      title={title}
      body={body}
      footer={footer}
      show={props.show}
      hide={close}
      parentProps={props}
    />
  );
}
