<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BookController extends AbstractController
{
    /**
     * @Route("/librarian/books", name="showBoooks",methods={"GET"})
     */
    public function showBooks()
    {
        return $this->render('book/librarianOffice/books.html.twig');
    }

    /**
     * @Route("/", name="home",methods={"GET"})
     */
    public function showHome()
    {
        return $this->render('home/home.html.twig');
    }
}
