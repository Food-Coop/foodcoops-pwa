import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { LagerModal } from "../lager/LagerModal";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useApi } from "../ApiService";
import Select from "react-select";
import "./AddNewFrischModal.css";

export function AddNewFrischModal(props) {
  const api = useApi();
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);

  const close = () => {
    props.close();
  };

  const handleSelectChange = selectedOption => {
    if (selectedOption) {
      setSelectedDiscrepancy(selectedOption.value);
  } else {
      setSelectedDiscrepancy(null);
  }
};

    const save = async () => {
        let zuVielzuWenig = document.getElementById("zuVielzuWenigId").value;
        console.log(props.discrepancyForModal);

        if (selectedDiscrepancy === null || zuVielzuWenig === "") {
          toast.error("Bitte füllen Sie alle Felder aus.");
          return;
        }

        let name = selectedDiscrepancy;
        let discrepancyElement= "";
        let response = "";

        if (props.discrepancyForModal.some(item => item.bestand.name === selectedDiscrepancy)) {
          discrepancyElement = props.discrepancyForModal.find(item => item.bestand.name === selectedDiscrepancy);
          response = await api.updateDiscrepancy(discrepancyElement.id, zuVielzuWenig);
        } else {
          discrepancyElement = props.frischBestandForModal.find(item => item.name === selectedDiscrepancy);
          const discrepancy = {
                bestand:  { ...discrepancyElement, type: "frisch" },
                gewollteMenge: 0,
                zuBestellendeGebinde: 0,
                zuVielzuWenig: zuVielzuWenig,
          };
          response = await api.addDiscrepancyToLastOrderList(discrepancy);
        }

        if (response.ok) {
            toast.success(name + " wurde erfolgreich zur Liste hinzugefügt.");
        } else {
            console.error("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        }
        props.updateParent();
        props.close();
    }

  const title = "Produkt hinzufügen";

  const options = props.frischBestandForModal
    .filter(item => !props.discrepancyForModal.some(discrepancy => discrepancy.bestand.name === item.name && discrepancy.zuVielzuWenig !== 0))
    .map((item) => ({
        value: item.name,
        label: item.name,
    }));

  const body = (
    <div className="firstDiv" >
        <table className="tableInModal" >
            <tr>
                <td style={{ padding: "0 0 10px 0px" }}>Produkt: <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isClearable={true}
                    isSearchable={true}
                    onChange={handleSelectChange}
                    name="frischBestand"
                    placeholder="Produkt auswählen"
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
