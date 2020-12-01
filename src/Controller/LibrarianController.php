<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LibrarianController extends AbstractController
{
    /**
     * @Route("/librarian/books", name="showBooks",methods={"GET"})
     */
    public function showBooks()
    {
        return $this->render('librarian/books.html.twig',[]);
    }
}
