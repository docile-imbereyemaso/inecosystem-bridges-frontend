import { useEffect, useState } from "react";
import { FaAward, FaCalendarAlt } from "react-icons/fa";

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/certificates/getUserCertificate"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch certificates");
        }
        const data = await res.json();
        setCertificates(data);
      } catch (err) {
        console.error("Error fetching certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Certificates</h1>

      {loading ? (
        <p className="text-gray-500">Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <p className="text-gray-500">No certificates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.certificate_id}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <FaAward className="text-indigo-500 text-2xl" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {cert.name}
                </h2>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Organization:</span>{" "}
                {cert.issuing_organization}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Type:</span>{" "}
                {cert.certificate_type}
              </p>

              <div className="flex items-center text-gray-500 text-sm mb-2">
                <FaCalendarAlt className="mr-2" />
                Issued: {new Date(cert.issue_date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <FaCalendarAlt className="mr-2" />
                Expires: {new Date(cert.expiry_date).toLocaleDateString()}
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Credential ID:</span>{" "}
                {cert.credential_id}
              </p>

              {cert.skills && cert.skills.length > 0 && (
                <div className="mt-3">
                  <span className="font-semibold text-sm text-gray-700">
                    Skills:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {cert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cert.description && (
                <p className="mt-3 text-gray-600 text-sm">
                  {cert.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Certificates;
