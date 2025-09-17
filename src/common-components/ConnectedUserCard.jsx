import React from "react";

const ConnectedUserCard = ({ connection }) => {
  const { connected_user } = connection;

  return (
    <div className="">
      <div className="flex items-center p-6">
        {/* Profile Image */}
        <img
          src={connected_user.profile_image || "https://via.placeholder.com/80"}
          alt={`${connected_user.first_name} ${connected_user.last_name}`}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
        />

        {/* User Info */}
        <div className="ml-6 flex-1">
          <h2 className="text-xl font-semibold text-gray-800">
            {connected_user.first_name} {connected_user.last_name}
          </h2>
          <p className="text-gray-600">{connected_user.email}</p>
          {connected_user.phone && (
            <p className="text-gray-600">📞 {connected_user.phone}</p>
          )}
          {connected_user.user_type && (
            <p className="text-gray-500 text-sm mt-1 capitalize">
              Type: {connected_user.user_type.replace("-", " ")}
            </p>
          )}
          {connected_user.status && (
            <p className="text-gray-500 text-sm">
              Status: {connected_user.status.replace("-", " ")}
            </p>
          )}

 {connected_user.about && (
            <p className="text-gray-500 text-sm">
              About: {connected_user.about}
            </p>
          )}

          {/* Resume & Document */}
          <div className="mt-3 flex flex-wrap gap-2">
            {connected_user.resume && (
              <a
                href={connected_user.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                View Resume
              </a>
            )}
            {connected_user.official_document && (
              <a
                href={connected_user.official_document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
              >
                Official Document
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Skills & Sectors */}
      {(connected_user.skills.length > 0 || connected_user.sectors.length > 0) && (
        <div className="px-6 pb-4">
          {connected_user.skills.length > 0 && (
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Skills:</span> {connected_user.skills.join(", ")}
            </p>
          )}
          {connected_user.sectors.length > 0 && (
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Sectors:</span> {connected_user.sectors.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectedUserCard;
