import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import { useMediaQuery } from 'react-responsive'
import Axios from 'axios';
import './App.css';
 
function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [imageData, setImageData] = useState([]);
  const [aboutData, setAboutData] = useState();
  const [lightBox, setLightBox] = useState();
  const [lightBoxSetting, toggleLightBox] = useState(false);
  const [lightBoxTitle, setLightBoxTitle] = useState();
  const [lightBoxDescription, setLightBoxDescription] = useState();
  const [imageURL, setImageURL] = useState(false);
  const [aboutContact, showAboutContact] = useState(false);
  const [mobileMenu, showMobileMenu] = useState(false);
  const [active, setActive] = useState('#all');
  const [oldActive, setOldActive] = useState('#all');

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })

  const API = "https://lauren-api-mongo.herokuapp.com";

  imageData.sort((a, b) => {
    return a.order - b.order;
  })

  const imageDataList = imageData.map((piece, index) => (
    <div key={index} onClick={() => {
      setLightBox(index);
      setImageURL(piece.Image[0].url);
      toggleLightBox(true);
      setLightBoxTitle(piece.Title);
      setLightBoxDescription(piece.Description);
    }} className={"image-parent " + piece.ImageSize + " " + piece.ImageType}>
        <img className={"image"} key={index} src={piece.Image[0].url} />
      <div className="overlay-container">
        <div className="overlay"></div>
        <p className="title">{piece.Title}</p>
      </div>
    </div>
  ))
 
  useEffect(() => {
    async function fetchData() {
      const response = await Axios.get(API + '/pieces');
      const aboutResponse = await Axios.get(API + '/abouts');
      setAboutData(aboutResponse.data)
      setImageData(response.data)
      setIsLoading(false);
    }
    fetchData()
  }, [])
 
  useEffect(() => {

    if(isLoading === false) {
    document.querySelector('.lightbox').id = "image-" + lightBox;
    if(lightBoxSetting === true) {
      document.querySelector('.lightbox').style.visibility = 'visible';
      document.querySelector('.lightbox').style.textDecoration = "none";
    } else {
      document.querySelector('.lightbox').style.visibility = "hidden";
      document.querySelector('body').style.overflow = 'visible';
    }

 
    const mobileMenuItems = document.querySelectorAll('.mobile-menu')
 
    if(mobileMenu === true) {
      document.querySelector('#bottom-span').style.display = "none";
      document.querySelector('#top-span').style.transform = "translateY(14px) rotate(45deg)"
      document.querySelector('#top-span').style.borderColor = "white"
      document.querySelector('#middle-span').style.transform = "rotate(-45deg)"
      document.querySelector('#middle-span').style.borderColor = "white"
      document.querySelector('#mobile-menu-container').style.width = "80%"
      for( let i = 0; i < mobileMenuItems.length; i++ ) {
        mobileMenuItems[i].style.transform = "translateX(0)"
      }
    } else {
      document.querySelector('#bottom-span').style.display = "block";
      document.querySelector('#top-span').style.transform = "translateY(0) rotate(0)"
      document.querySelector('#top-span').style.borderColor = "#615e5a"
      document.querySelector('#middle-span').style.transform = "rotate(0)"
      document.querySelector('#middle-span').style.borderColor = "#615e5a"
      document.querySelector('#mobile-menu-container').style.width = "0"
      for( let i = 0; i < mobileMenuItems.length; i++ ) {
        mobileMenuItems[i].style.transform = "translateX(%200)"
      }
    }
 
    if (aboutContact === true) {
      document.querySelector('#imageContainer').style.display = "none";
      document.querySelector('.ac-container').style.display = "flex";
    } else {
      document.querySelector('#imageContainer').style.display = "flex";
      document.querySelector('.ac-container').style.display = "none";
    }
      
    if (active !== oldActive) {
      document.querySelector(oldActive).classList.remove('active');
      document.querySelector(active).classList.add('active');
    }
  }
  })
 
 
  if(isLoading) {
    return(
    <div className="loader">
      <div className="lds-heart">
        <div></div>
      </div>
      <div className="loader-text">Loading...</div>
    </div>
    )
  } else {
  return (
    <div className="App" id="container">
      <div id="mobile-menu-container">
          <button onClick={() => showMobileMenu(!mobileMenu)} className="open-menu">
            <span id="top-span"></span>
            <span id="middle-span"></span>
            <span id="bottom-span"></span>
          </button>
          <a className="mobile-menu" onClick={() => {
            showAboutContact(false);
            showMobileMenu(false);
          }}>All</a>
          <a className="mobile-menu" onClick={() => {
            showAboutContact(true);
            showMobileMenu(false);
          }}>About / Contact</a>
        </div>
 
      <div id="header">
        <div id="logo">
          <p id="logo-name">LAUREN PICKERING</p>
          <p id="logo-job">Illustrator / Visual Development / Character Design</p>
        </div>
        <div id="menu">
          <a className="active" id="all" onClick={() => {
            showAboutContact(false);
            setOldActive(active);
            setActive('#all')
          }}>All</a>
          <a id="about-contact" onClick={() => {
            showAboutContact(true);
            setOldActive(active);
            setActive('#about-contact')
          }}>About / Contact</a>
        </div>
      </div>
 
      <div id="imageContainer">
        {imageDataList}
      </div>
      <div onClick={() => {
        isDesktopOrLaptop && toggleLightBox(false)
        }} href="#" className="lightbox">
        <img className="lightbox-image" src={imageURL} />
        <div className="lightbox-text">
          <p className="lightbox-text-title">{lightBoxTitle}</p>
          <p className="lightbox-text-description"><ReactMarkdown>{lightBoxDescription}</ReactMarkdown></p>
        </div>
      </div>
      <div className="ac-container">
        <div className="about-container">
          <img src={aboutData[0].Image[0].url}/>
          <div id="about-text-container">
            <p className="about-container-title">{aboutData[0].Title}</p>
            <p className="about-container-description"><ReactMarkdown>{aboutData[0].Description}</ReactMarkdown></p>
            <div className="about-container-social">
            <a href="https://www.linkedin.com/in/lauren-pickering-879763179/" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 0 1-1.548-1.549 1.548 1.548 0 1 1 1.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z" fill="#615e5a"/></svg></a>
            <a href="mailto:laurenpickering07@gmail"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm9.06 8.683L5.648 6.238 4.353 7.762l7.72 6.555 7.581-6.56-1.308-1.513-6.285 5.439z" fill="#615e5a"/></svg></a>
            <a className="resume-icon" href="http://laurenpickering.art/Pickering_Lauren_Resume.pdf" target="blank">Resume</a>
          </div>
          </div>
        </div>
        <div className="contact-container">
          <p>CONTACT ME</p>
          <form action="https://formspree.io/f/xnqokqbn" method="POST">
            <label>
              <input placeholder="Name..." type="text" name="name" />
            </label>
            <label>
              <input placeholder="Email..." type="text" name="_replyto" />
            </label>
            <label>
              <textarea placeholder="Description..." name="message"></textarea>
            </label>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
}
 
export default App;