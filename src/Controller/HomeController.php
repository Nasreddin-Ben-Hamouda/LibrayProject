<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{

    /**
     * @Route("/", name="home",methods={"GET"})
     */
    public function showHome()
    {
        return $this->render('home/home.html.twig',[]);
    }
    /**
     * @Route("/contacts", name="contacts",methods={"GET"})
     */
    public function showContacts()
    {
        return $this->render('home/contacts.html.twig',[]);
    }
    /**
     * @Route("/about", name="about",methods={"GET"})
     */
    public function showAboutUs()
    {
        return $this->render('home/about.html.twig',[]);
    }
    /**
     * @Route("/profile", name="profile",methods={"GET"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function showProfile()
    {
        return $this->render('home/profile.html.twig',[]);
    }


}
