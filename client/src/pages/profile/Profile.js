import React, { useEffect, useState } from "react";
import "./Profile.scss";
import PageMenu from "../../components/pagemenu/PageMenu";
import loginImg from "../../assets/profile.png";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/card/Card";
import {
  getUser,
  updatePhoto,
  updateUser,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { toast } from "react-toastify";
import { firstName } from "../../utils";

const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
const base_URL = "https://api.cloudinary.com/v1_1/dddmasqhk/image/upload";

const Profile = () => {
  const { isLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const initialState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    address: user?.address || {
      address: "",
      state: "",
      country: "",
    },
  };
  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const saveProfile = async (e) => {
    e.preventDefault();
    const userData = {
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
    };
    await dispatch(updateUser(userData));
  };

  const savePhoto = async (e) => {
    e.preventDefault();
    let imageURL;

    try {
      if (
        profileImage !== null &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", cloud_name);
        image.append("upload_preset", uploadPreset);

        //save image to cloudinary
        const res = await fetch(base_URL, {
          method: "POST",
          body: image,
        });

        const imageData = await res.json();
        //console.log(imageData);
        imageURL = imageData.url.toString();
      }

      const userData = {
        photo: imageURL || profile.photo,
      };
      await dispatch(updatePhoto(userData));
      setImagePreview(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Split the name into an array to access nested properties
    const nameArray = name.split(".");

    if (nameArray.length === 2) {
      // Handle the nested structure
      const updatedProfile = {
        ...profile,
        [nameArray[0]]: {
          ...profile[nameArray[0]],
          [nameArray[1]]: value,
        },
      };
      setProfile(updatedProfile);
    } else {
      // Handle top-level properties
      setProfile({ ...profile, [name]: value });
    }
  };

  useEffect(() => {
    if (user === null) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "",
        address: user?.address || profile.address,
      });
    }
  }, [user]);

  return (
    <section className="--bg-grey">
      {isLoading && <Loader />}

      <div className="container --mt">
        <PageMenu />
        <h2>Profile</h2>
        <div className="--flex-between --mb profile">
          <Card cardClass={"card"}>
            {!isLoading && user && (
              <>
                <div className="profile-photo">
                  <div className="--center-all">
                    <img src={imagePreview || user?.photo} alt="profile" />
                    <h3>Role: {profile.role}</h3>
                    {imagePreview !== null && (
                      <button
                        className="--btn --btn--secondary"
                        onClick={savePhoto}
                      >
                        <AiOutlineCloudUpload size={18} /> Upload Photo
                      </button>
                    )}
                  </div>
                </div>
                <form onSubmit={saveProfile}>
                  <p>
                    <label htmlFor="image">Change Photo:</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </p>
                  <p>
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile?.name}
                      onChange={handleInputChange}
                      required
                    />
                  </p>
                  <p>
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile?.email}
                      onChange={handleInputChange}
                      disabled
                      required
                    />
                  </p>
                  <p>
                    <label htmlFor="phone">Phone:</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={profile?.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </p>
                  <p>
                    <label htmlFor="address">Address:</label>
                    <input
                      type="text"
                      id="address"
                      name="address.address"
                      value={profile?.address?.address}
                      onChange={handleInputChange}
                    />
                  </p>
                  <p>
                    <label htmlFor="state">State:</label>
                    <input
                      type="text"
                      id="state"
                      name="address.state"
                      value={profile?.address?.state}
                      onChange={handleInputChange}
                    />
                  </p>
                  <p>
                    <label htmlFor="country">Country:</label>
                    <input
                      type="text"
                      id="country"
                      name="address.country"
                      value={profile?.address?.country}
                      onChange={handleInputChange}
                    />
                  </p>
                  <button className="--btn --btn-primary --btn-block">
                    Update Profile
                  </button>
                </form>
              </>
            )}
          </Card>
          <div className="--card">
            <img src={loginImg} alt="login" width="400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const UserName = () => {
  const { user } = useSelector((state) => state.auth);
  const username = user?.name || "...";

  return <span style={{ color: "#ff7722" }}>Hi, {firstName(username)} |</span>;
};

export default Profile;
