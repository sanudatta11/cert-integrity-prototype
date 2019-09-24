const getHeader = {
  headers: {
    Accept: "application/json"
  }
};

const postHeader = {
  method: "POST",
  headers: {
    ...getHeader,
    "Content-Type": "application/json"
  }
};

let host = "";

if (process.env.NODE_ENV !== "production") host = "https://3000-bdc74574-01b7-4c5f-9fb2-d8d64021a035.ws-ap0.gitpod.io";

export const getCertificate = certificateId =>
  fetch(`${host}/certificate/data/${certificateId}`, getHeader)
    .then(res => res.json())
    .catch(err => {
      console.log(err);
    });

export const verifyCertificate = certificateId =>
  fetch(`${host}/certificate/verify/${certificateId}`, getHeader)
    .then(res => {
      if (res.status === 200) return true;
      else if (res.status === 401) return false;
    })
    .catch(err => {
      console.log(err);
    });

export const generateCertificate = (
  candidateName,
  courseName,
  orgName,
  assignDate,
  duration,
  emailId
) =>
  fetch(`${host}/certificate/generate`, {
    ...postHeader,
    body: JSON.stringify({
      candidateName,
      courseName,
      orgName,
      assignDate,
      duration,
      emailId
    })
  })
    .then(res => res.json())
    .catch(err => {
      console.log(err);
    });
