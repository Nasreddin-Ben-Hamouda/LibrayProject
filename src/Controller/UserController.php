<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    /**
     * @Route("/user", name="user",methods={"GET"})
     */
    public function index()
    {
        return $this->render('book/librarianOffice/books.html.twig');
    }

}
