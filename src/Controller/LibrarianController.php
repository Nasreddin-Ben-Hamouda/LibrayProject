<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LibrarianController extends AbstractController
{
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager=$manager;
    }
    /**
     * @Route("/librarian/dashboard", name="showLibrarianDashboard",methods={"GET"})
     */
    public function showDashboard()
    {
        return $this->render('librarian/dashboard.html.twig',[]);
    }
    /**
     * @Route("/librarian/profile", name="showLibrarianProfile",methods={"GET"})
     */
    public function showProfile()
    {
        return $this->render('librarian/profile.html.twig',[]);
    }
    /**
     * @Route("/librarian/books", name="showBooks",methods={"GET"})
     */
    public function showBooks()
    {
        return $this->render('librarian/books.html.twig',[]);
    }
    /**
     * @Route("/librarian/lateBooks", name="showLateBooks",methods={"GET"})
     */
    public function showLateBooks()
    {
        return $this->render('librarian/lateBooks.html.twig',[]);
    }

}
